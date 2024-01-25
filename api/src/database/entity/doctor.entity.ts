import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { DepartmentEntity } from './department.entity';
import { DoctorAvailableSlotEntity } from './doctor-available-slot.entity';
import { ReviewEntity } from './review.entity';
import { UserEntity } from './user.entity';

@Entity('doctor')
export class DoctorEntity {
  @PrimaryGeneratedColumn({ name: 'doctor_id' })
  id!: number;

  @Column()
  speciality!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  user?: UserEntity;

  @Column()
  userId!: number;

  @OneToMany(
    () => DoctorAvailableSlotEntity,
    (doctorAvailableSlots) => doctorAvailableSlots.doctor,
  )
  availableSlots!: DoctorAvailableSlotEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  appointments?: AppointmentEntity[];

  // TODO: check if no action is correct
  @ManyToMany(() => DepartmentEntity, (department) => department.doctors, {
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  departments?: DepartmentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.doctor)
  reviews?: ReviewEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
