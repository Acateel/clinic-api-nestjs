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
import { DepartmentEntity } from 'src/database/entity/department.entity';
import { DoctorAvailableSlotEntity } from 'src/database/entity/doctor-available-slot.entity';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { ReviewEntity } from 'src/database/entity/review.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { EmailService } from 'src/email/email.service';
import { In, Repository } from 'typeorm';
import { AddReviewDto } from './dto/add-review.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { GetDoctorQueryDto } from './dto/get-doctor-query.dto';
import { InviteDoctorDto } from './dto/invite-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
    @InjectRepository(DoctorAvailableSlotEntity)
    private readonly doctorAvailableSlotRepository: Repository<DoctorAvailableSlotEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    dto: CreateDoctorDto,
    payload: AccessTokenPayload,
  ): Promise<DoctorEntity | null> {
    const doctor = new DoctorEntity();
    doctor.speciality = dto.speciality;

    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    doctor.user = user;

    if (dto.departmentIds) {
      const departments = await this.departmentRepository.findBy({
        id: In(dto.departmentIds),
      });

      if (departments.length !== dto.departmentIds.length) {
        throw new NotFoundException('Some of departments were not found');
      }

      doctor.departments = departments;
    }

    return this.doctorRepository.manager.transaction(async (entityManager) => {
      const createdDoctor = await entityManager.save(doctor);

      if (dto.availableSlots) {
        const doctorAvailableSlots = dto.availableSlots.map((slot) => ({
          doctor: createdDoctor,
          ...slot,
        }));

        await entityManager.insert(
          DoctorAvailableSlotEntity,
          doctorAvailableSlots,
        );
      }

      return entityManager.findOneBy(DoctorEntity, { id: createdDoctor.id });
    });
  }

  async get(query: GetDoctorQueryDto): Promise<DoctorEntity[]> {
    const queryBuilder = this.doctorRepository.createQueryBuilder('doctor');

    if (query.speciality) {
      queryBuilder.andWhere('doctor.speciality = :speciality', {
        speciality: query.speciality,
      });
    }

    if (query.fullName) {
      queryBuilder.leftJoin('doctor.user', 'user');
      queryBuilder.andWhere('user.fullName = :fullName', {
        fullName: query.fullName,
      });
    }

    if (query.sort === 'appointments') {
      queryBuilder
        .select((subQuery) =>
          subQuery
            .select('COUNT(appointment_id)', 'appointment_count')
            .from(AppointmentEntity, 'appointment')
            .where('appointment.id = doctor.id'),
        )
        .addOrderBy('appointment_count', 'DESC');
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    return queryBuilder.getMany();
  }

  // TODO: strong typing
  async getById(id: number): Promise<any> {
    // TODO: use single query runner instance?
    // TODO: cache at least rating
    const avgRating = await this.doctorRepository.manager.connection
      .createQueryBuilder(ReviewEntity, 'review')
      .select('AVG(rating)', 'rating')
      .where('review.doctor_id = :id', { id })
      .groupBy('review_id')
      .getRawOne();

    const doctor = await this.doctorRepository
      .createQueryBuilder('doctor')
      .where('doctor.id = :id', { id })
      .addSelect(['doctor.createdAt'])
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.appointments', 'appointment')
      .leftJoinAndSelect('doctor.availableSlots', 'available_slot')
      .leftJoinAndSelect('doctor.reviews', 'review')
      .getOne();

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return { ...doctor, rating: avgRating.rating };
  }

  async update(id: number, dto: UpdateDoctorDto): Promise<DoctorEntity | null> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: { appointments: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    doctor.speciality = dto.speciality ?? doctor.speciality;

    return this.doctorRepository.manager.transaction(async (entityManager) => {
      if (!dto.availableSlots) {
        return this.doctorRepository.findOneBy({ id: doctor.id });
      }

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

      const doctorAvailableSlotRepository = entityManager.getRepository(
        DoctorAvailableSlotEntity,
      );

      const storedDoctorSlots = await doctorAvailableSlotRepository.findBy({
        doctorId: doctor.id,
      });
      await entityManager.remove(storedDoctorSlots);

      const doctorAvailableSlots = dto.availableSlots.map((slot) => ({
        doctor,
        ...slot,
      }));
      await doctorAvailableSlotRepository.insert(doctorAvailableSlots);

      const doctorRepository = entityManager.getRepository(DoctorEntity);

      delete doctor.appointments;
      await doctorRepository.update(doctor.id, doctor);

      return doctorRepository.findOneBy({ id: doctor.id });
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.doctorRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Doctor not found');
    }
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
    )}api/v1/auth/register/${inviteToken}`;

    this.emailService.send(dto.email, 'Invite', 'invite-i18n', {
      inviteLink,
    });
  }

  async addReview(
    id: number,
    dto: AddReviewDto,
    payload: AccessTokenPayload,
  ): Promise<ReviewEntity> {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const doctor = await this.doctorRepository.findOneBy({ id });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const reviewDetails = await this.reviewRepository.save({
      doctor,
      user,
      ...dto,
    });
    const review = await this.reviewRepository.findOneBy({
      id: reviewDetails.id,
    });

    return review!;
  }
}
