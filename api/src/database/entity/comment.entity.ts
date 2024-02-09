import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment')
@Tree('closure-table')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  text!: string | null;

  @Column({ default: 0 })
  upVotes!: number;

  @Column({ default: 0 })
  downVotes!: number;

  @TreeParent()
  parentComment?: CommentEntity;

  @TreeChildren()
  childComments?: CommentEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
