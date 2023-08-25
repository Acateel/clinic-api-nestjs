import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { PatientEntity } from './patient.entity';
import { DoctorEntity } from './doctor.entity';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn({ name: 'appointment_id' })
  id!: number;

  @Column({
    type: 'timestamp',
    transformer: {
      to(value: Date | string) {
        return new Date(value);
      },
      from(value: string) {
        return new Date(value);
      },
    },
  })
  date!: Date;

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE', nullable: false })
  patient?: PatientEntity;

  @RelationId((appointment: AppointmentEntity) => appointment.patient)
  patientId!: number;

  @ManyToOne(() => DoctorEntity, { onDelete: 'CASCADE', nullable: false })
  doctor?: DoctorEntity;

  @RelationId((appointment: AppointmentEntity) => appointment.doctor)
  doctorId!: number;

  @CreateDateColumn({ select: false })
  createdAt?: Date;
}
