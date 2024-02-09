import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';
import { UserEntity } from './user.entity';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  id!: number;

  @Column()
  rating!: number;

  @Column({ type: 'varchar', nullable: true })
  comment!: string | null;

  // @Column()
  // upVotes!: number;

  // @Column({ default: 0 })
  // downVotes!: number;

  // TODO: add comments relations here?

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: false })
  user?: UserEntity;

  @Column()
  userId!: number;

  @ManyToOne(() => DoctorEntity, { onDelete: 'CASCADE' })
  doctor?: DoctorEntity;

  @Column({ nullable: true })
  doctorId!: number | null;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
