import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
  ) {}

  getPopularSpecialities() {
    return this.doctorRepository
      .createQueryBuilder('d')
      .select('speciality')
      .addSelect('COUNT(*)', 'doctors_count')
      .groupBy('speciality')
      .orderBy('doctors_count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  getPopularDoctorsInTimeframe(query: { fromDate?: Date; toDate?: Date }) {
    const queryBuilder = this.doctorRepository
      .createQueryBuilder('d')
      .select('full_name')
      .addSelect('COUNT(appointment_id)', 'appointments_count')
      .innerJoin('d.user', 'du')
      .innerJoin('d.appointments', 'da');

    if (query.fromDate) {
      queryBuilder.andWhere('da.created_at >= :fromDate', {
        fromDate: query.fromDate.toISOString(),
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere('da.created_at <= :toDate', {
        toDate: query.toDate.toISOString(),
      });
    }

    return queryBuilder
      .groupBy('d.doctor_id, du.full_name')
      .orderBy('appointments_count', 'DESC')
      .limit(10)
      .getRawMany();
  }
}
