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
// TODO: try delete appointment when linked to doctor or patient
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'appointment_id' })
  id!: string;

  @Column()
  date!: Date;

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE', nullable: false })
  patient?: PatientEntity;

  @RelationId((appointment: AppointmentEntity) => appointment.patient)
  patientId!: string;

  @ManyToOne(() => DoctorEntity, { onDelete: 'CASCADE', nullable: false })
  doctor?: DoctorEntity;

  @RelationId((appointment: AppointmentEntity) => appointment.doctor)
  doctorId!: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt!: Date;
}
