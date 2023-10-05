import { UserEntity } from 'src/database/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';

@Entity('patient')
export class PatientEntity {
  @PrimaryGeneratedColumn({ name: 'patient_id' })
  id!: number;

  @Column({ unique: true })
  phoneNumber!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ name: 'user_id' })
  userId!: number;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.patient)
  appointments?: AppointmentEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;
}
