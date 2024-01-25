import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('doctor_available_slot')
export class DoctorAvailableSlotEntity {
  @PrimaryGeneratedColumn({ name: 'doctor_available_slot_id' })
  id!: number;

  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({ type: 'timestamptz' })
  endDate!: Date;

  @ManyToOne(() => DoctorEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  doctor?: DoctorEntity;

  @Column()
  doctorId!: number;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
