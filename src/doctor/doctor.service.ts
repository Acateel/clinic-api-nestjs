import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { Repository } from 'typeorm';
import { AccessTokenPayload, AppConfig } from 'src/common/interface';
import { UpdateDoctorDto } from './dto/updateDoctor.dto';
import { AppointmentEntity } from 'src/database/entity/appointment.entity';
import { DoctorAvailableSlotEntity } from 'src/database/entity/doctorAvailableSlots.entity';
import { checkIntervalsOverlap } from 'src/common/util';
import { InviteDoctorDto } from './dto/inviteDoctor.dto';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRoleEnum } from 'src/common/enum';
import { UserEntity } from 'src/database/entity/user.entity';

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

  async create(dto: CreateDoctorDto, payload: AccessTokenPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const doctor = this.doctorRepository.create({ ...dto, user });
    const createdDoctor = await this.doctorRepository.save(doctor);

    return this.doctorRepository.findOneBy({ id: createdDoctor.id });
  }

  async get(options) {
    const queryBuilder = this.doctorRepository.createQueryBuilder('d');

    if (options.speciality) {
      queryBuilder.andWhere('d.speciality = :speciality', {
        speciality: options.speciality,
      });
    }

    if (options.fullName) {
      queryBuilder.leftJoin('d.user', 'du');
      queryBuilder.andWhere('du.fullName = :fullName', {
        fullName: options.fullName,
      });
    }

    if (options.sort === 'appointments') {
      queryBuilder
        .select(
          (subQuery) =>
            subQuery
              .select('COUNT(appointment_id)', 'ac')
              .from(AppointmentEntity, 'a')
              .where('a.id = d.id'),
          'a',
        )
        .addOrderBy('a', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async getById(id: number) {
    const doctor = await this.doctorRepository
      .createQueryBuilder('d')
      .where('d.id = :id', { id })
      .addSelect(['d.createdAt'])
      .leftJoinAndSelect('d.user', 'du')
      .leftJoinAndSelect('d.appointments', 'dap')
      .leftJoinAndSelect('d.availableSlots', 'dav')
      .getOne();

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: { appointments: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    this.doctorRepository.merge(doctor, dto);

    if (dto.availableSlots) {
      if (doctor.appointments) {
        for (const slot of dto.availableSlots) {
          const isFreeSlotTaken = doctor.appointments.some((appointment) =>
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

    const createdDoctor = await this.doctorRepository.save(doctor);

    return this.doctorRepository.findOneBy({ id: createdDoctor.id });
  }

  async delete(id: number) {
    await this.doctorRepository.delete(id);
  }

  async invite(dto: InviteDoctorDto) {
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

    this.emailService.sendInvite(dto.email, inviteLink);
  }
}
