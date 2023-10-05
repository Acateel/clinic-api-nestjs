import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { DoctorAvailableSlotEntity } from './doctor-available-slot.entity';
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
    {
      cascade: true,
      eager: true,
    },
  )
  availableSlots!: DoctorAvailableSlotEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  appointments?: AppointmentEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;
}
