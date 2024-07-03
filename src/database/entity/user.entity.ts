import { UserRoleEnum } from 'src/common/enum';
import { PatientEntity } from 'src/database/entity/patient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';
import { UserNotificationEntity } from './user-notification.entity';
import { FeedbackEntity } from './feedback.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password?: string;

  @Column({ type: 'enum', enum: UserRoleEnum })
  role!: UserRoleEnum;

  @Column()
  fullName!: string;

  @Column({ nullable: true, type: String })
  avatar!: string | null;

  @Column({ type: String, select: false, nullable: true })
  resetToken?: string | null;

  @Column({ type: String, select: false, nullable: true })
  refreshToken?: string | null;

  @OneToMany(() => PatientEntity, (patient) => patient.user)
  patients?: PatientEntity[];

  @OneToMany(() => DoctorEntity, (doctor) => doctor.user)
  doctors?: DoctorEntity[];

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.user)
  feedbacks?: FeedbackEntity[];

  @OneToMany(() => UserNotificationEntity, (notification) => notification.user)
  notifications?: UserNotificationEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
