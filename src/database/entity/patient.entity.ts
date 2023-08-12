import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from 'src/database/entity/user.entity';

@Entity('patient')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'patient_id' })
  id!: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @RelationId((patient: PatientEntity) => patient.user)
  userId!: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;
}
