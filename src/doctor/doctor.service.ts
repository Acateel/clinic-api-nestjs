import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEnum } from 'src/common/enum';
import { AccessTokenPayload, AppConfig } from 'src/common/interface';
import { checkIntervalsOverlap } from 'src/common/util';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DoctorAvailableSlotEntity } from 'src/database/entity/doctor-available-slot.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { InviteDoctorDto } from './dto/invite-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    dto: CreateDoctorDto,
    payload: AccessTokenPayload,
  ): Promise<DoctorEntity | null> {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdDoctor = await this.doctorRepository.save({ ...dto, user });

    return this.doctorRepository.findOneBy({ id: createdDoctor.id });
  }

  async get(options): Promise<DoctorEntity[]> {
    const queryBuilder = this.doctorRepository.createQueryBuilder('doctor');

    if (options.speciality) {
      queryBuilder.andWhere('doctor.speciality = :speciality', {
        speciality: options.speciality,
      });
    }

    if (options.fullName) {
      queryBuilder.leftJoin('doctor.user', 'user');
      queryBuilder.andWhere('user.fullName = :fullName', {
        fullName: options.fullName,
      });
    }

    if (options.sort === 'appointments') {
      queryBuilder
        .select((subQuery) =>
          subQuery
            .select('COUNT(appointment_id)', 'appointment_count')
            .from(AppointmentEntity, 'appointment')
            .where('appointment.id = doctor.id'),
        )
        .addOrderBy('appointment_count', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async getById(id: number): Promise<DoctorEntity> {
    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .where('doctor.id = :id', { id })
      .addSelect(['doctor.createdAt'])
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.appointments', 'appointment')
      .leftJoinAndSelect('doctor.availableSlots', 'available_slot')
      .getOne();

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto): Promise<DoctorEntity | null> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      // relations: { appointments: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.speciality = dto.speciality ?? doctor.speciality;

    if (dto.availableSlots) {
      // TODO: использовать preload для джоина после условия? Вместо сразу в findOne
      const doctorWithAppointments = await this.doctorRepository.preload({
        ...doctor,
        appointments: doctor.appointmentIds.map((id) => ({
          id,
        })) as AppointmentEntity[],
      });
      const doctorAppointments = doctorWithAppointments?.appointments;

      if (doctorAppointments) {
        for (const slot of dto.availableSlots) {
          const isFreeSlotTaken = doctorAppointments.some((appointment) =>
            checkIntervalsOverlap(slot, appointment),
          );

          if (isFreeSlotTaken) {
            throw new ConflictException(
              'Doctor has scheduled appointment on free slot time',
            );
          }
        }
      }

      doctor.availableSlots = dto.availableSlots as DoctorAvailableSlotEntity[];
    }

    // TODO: обновление сущности с каскадными отношениями только через save?
    const updatedDoctor = await this.doctorRepository.save(doctor);

    return this.doctorRepository.findOneBy({ id: updatedDoctor.id });
  }

  async delete(id: number): Promise<void> {
    await this.doctorRepository.delete(id);
  }

  async invite(dto: InviteDoctorDto): Promise<void> {
    const inviteToken = this.jwtService.sign(
      {
        email: dto.email.toLowerCase(),
        role: UserRoleEnum.DOCTOR,
      },
      {
        secret: this.configService.get('jwt.inviteSecret', { infer: true }),
        expiresIn: this.configService.get('jwt.inviteLifetime', {
          infer: true,
        }),
      },
    );
    const inviteLink = `${this.configService.get(
      'apiUrl',
    )}/auth/register/${inviteToken}`;

    await this.emailService.sendInvite(dto.email, inviteLink);
  }
}
