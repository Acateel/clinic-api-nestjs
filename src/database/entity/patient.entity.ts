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
  @PrimaryGeneratedColumn({ name: 'patient_id' })
  id!: number;

  @Column({ unique: true })
  phoneNumber!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  user?: UserEntity;

  @RelationId((patient: PatientEntity) => patient.user)
  userId!: number;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.patient)
  appointments?: AppointmentEntity[];

  @RelationId((patient: PatientEntity) => patient.appointments)
  appointmentIds!: number[];

  @CreateDateColumn({ select: false })
  createdAt?: Date;
}
