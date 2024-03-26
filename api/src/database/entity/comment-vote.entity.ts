import { VoteEnum } from 'src/common/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment_vote')
export class CommentVoteEntity {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  commentId!: number;

  @Column({ type: 'enum', enum: VoteEnum })
  vote!: VoteEnum;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
