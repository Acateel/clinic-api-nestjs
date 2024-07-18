import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserNotificationTypeEnum } from '../../common/enum';
import { AppointmentEntity } from './appointment.entity';
import { UserEntity } from './user.entity';
import { FeedbackEntity } from './feedback.entity';

@Entity('user_notification')
export class UserNotificationEntity {
  @PrimaryGeneratedColumn({ name: 'review_notification_id' })
  id!: number;

  @Column({ type: 'enum', enum: UserNotificationTypeEnum })
  type!: UserNotificationTypeEnum;

  @Column()
  text!: string;

  @Column({ default: false })
  isSeen!: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: false })
  user?: UserEntity;

  @Column()
  userId!: number;

  @ManyToOne(() => FeedbackEntity, { onDelete: 'NO ACTION' })
  feedback?: FeedbackEntity;

  @Column({ nullable: true })
  feedbackId!: number | null;

  @ManyToOne(() => AppointmentEntity, { onDelete: 'NO ACTION' })
  appointment?: AppointmentEntity;

  @Column({ nullable: true })
  appointmentId!: number | null;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
