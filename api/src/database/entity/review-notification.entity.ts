import { ReviewNotificationTypeEnum } from 'src/common/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ReviewEntity } from './review.entity';
import { UserEntity } from './user.entity';

@Entity('review_notification')
export class ReviewNotificationEntity {
  @PrimaryGeneratedColumn({ name: 'review_notification_id' })
  id!: number;

  @Column({ type: 'enum', enum: ReviewNotificationTypeEnum })
  type!: ReviewNotificationTypeEnum;

  @Column({ default: false })
  isSeen!: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: false })
  user?: UserEntity;

  @Column()
  userId!: number;

  @ManyToOne(() => ReviewEntity, { onDelete: 'NO ACTION' })
  review?: ReviewEntity;

  @Column()
  reviewId!: number;

  @ManyToOne(() => CommentEntity, { onDelete: 'NO ACTION' })
  comment?: CommentEntity;

  @Column()
  commentId!: number;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
