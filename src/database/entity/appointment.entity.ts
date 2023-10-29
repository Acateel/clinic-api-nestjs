import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  patient?: PatientEntity;

  @Column()
  patientId!: number;

  @ManyToOne(() => DoctorEntity, { onDelete: 'CASCADE', nullable: false })
  doctor?: DoctorEntity;

  @Column()
  doctorId!: number;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
