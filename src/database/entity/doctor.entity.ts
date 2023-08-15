import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('doctor')
export class DoctorEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  speciality!: string;

  @Column({
    name: 'available_slots',
    type: 'timestamp',
    array: true,
  })
  availableSlots!: Date[];

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @RelationId((doctor: DoctorEntity) => doctor.user)
  userId!: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;
}
