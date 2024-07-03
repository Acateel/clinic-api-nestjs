import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';
import { UserEntity } from './user.entity';
import { FeedbackTypeEnum } from 'src/common/enum';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn({ name: 'feedback_id' })
  id!: number;

  @Column({ enum: FeedbackTypeEnum })
  feedbackType!: FeedbackTypeEnum;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ default: 0 })
  dislikeCount!: number;

  @Column({ type: 'varchar', nullable: true })
  text!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: false })
  user?: UserEntity;

  @Column()
  userId!: number;

  @ManyToOne(() => DoctorEntity, { onDelete: 'CASCADE' })
  doctor?: DoctorEntity;

  @Column({ nullable: true })
  doctorId!: number | null;

  @ManyToOne(() => FeedbackEntity, { nullable: true, onDelete: 'CASCADE' })
  parentComment?: FeedbackEntity;

  @Column({ nullable: true })
  parentCommentId!: number | null;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.parentComment)
  comments?: FeedbackEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
