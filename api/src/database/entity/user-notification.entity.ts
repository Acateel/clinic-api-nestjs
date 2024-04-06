import { UserNotificationTypeEnum } from 'src/common/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { CommentEntity } from './comment.entity';
import { ReviewEntity } from './review.entity';
import { UserEntity } from './user.entity';

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

  @ManyToOne(() => ReviewEntity, { onDelete: 'NO ACTION' })
  review?: ReviewEntity;

  @Column({ nullable: true })
  reviewId!: number | null;

  @ManyToOne(() => CommentEntity, { onDelete: 'NO ACTION' })
  comment?: CommentEntity;

  @Column({ nullable: true })
  commentId!: number | null;

  @ManyToOne(() => AppointmentEntity, { onDelete: 'NO ACTION' })
  appointment?: AppointmentEntity;

  @Column({ nullable: true })
  appointmentId!: number | null;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
