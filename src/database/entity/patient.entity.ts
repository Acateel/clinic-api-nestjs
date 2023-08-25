import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ unique: true })
  phoneNumber!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  user?: UserEntity;

  @RelationId((patient: PatientEntity) => patient.user)
  userId!: string;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.patient)
  appointments?: AppointmentEntity[];

  @RelationId((patient: PatientEntity) => patient.appointments)
  appointmentIds!: string;

  @CreateDateColumn({ select: false })
  createdAt?: Date;
}
