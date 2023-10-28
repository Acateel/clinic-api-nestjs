import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppointmentEntity } from './appointment.entity';
import { DepartmentEntity } from './department.entity';
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
  )
  availableSlots!: DoctorAvailableSlotEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  appointments?: AppointmentEntity[];

  @ManyToMany(() => DepartmentEntity, (department) => department.doctors, {
    onDelete: 'NO ACTION',
  })
  @JoinTable()
  departments?: DepartmentEntity[]; // TODO: rename departments

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;
}
