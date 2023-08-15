import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from 'src/database/entity/user.entity';
import { AppointmentEntity } from './appointment.entity';

@Entity('patient')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'patient_id' })
  id!: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @RelationId((patient: PatientEntity) => patient.user)
  userId!: string;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.patient)
  appointments?: AppointmentEntity[];

  @RelationId((patient: PatientEntity) => patient.appointments)
  appointmentIds!: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;
}
