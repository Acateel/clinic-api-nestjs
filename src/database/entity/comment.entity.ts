import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { ReviewEntity } from './review.entity';
import { UserEntity } from './user.entity';

@Entity('comment')
@Tree('closure-table')
export class CommentEntity {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  text!: string | null;

  @Column({ default: 0 })
  upVotes!: number;

  @Column({ default: 0 })
  downVotes!: number;

  @TreeParent()
  parentComment?: CommentEntity;

  @Column({ nullable: true })
  parentCommentId!: number | null;

  @TreeChildren()
  childComments?: CommentEntity[];

  @ManyToOne(() => ReviewEntity)
  review?: ReviewEntity;

  @Column({ nullable: true })
  reviewId!: number | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: false })
  user?: UserEntity;

  @Column()
  userId!: number;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
