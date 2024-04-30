import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { DoctorEntity } from './doctor.entity';
import { UserEntity } from './user.entity';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  id!: number;

  @Column()
  rating!: number;

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

  @OneToMany(() => CommentEntity, (comment) => comment.review)
  comments?: CommentEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
