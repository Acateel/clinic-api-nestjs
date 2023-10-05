import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';
import { PatientEntity } from './patient.entity';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn({ name: 'appointment_id' })
  id!: number;

  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({ type: 'timestamptz' })
  endDate!: Date;

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient?: PatientEntity;

  @Column({ name: 'patient_id' })
  patientId!: number;

  @ManyToOne(() => DoctorEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: DoctorEntity;

  @Column({ name: 'doctor_id' })
  doctorId!: number;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;
}
