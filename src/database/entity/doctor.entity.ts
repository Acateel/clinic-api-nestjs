import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
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

  @RelationId((doctor: DoctorEntity) => doctor.user)
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

  @ManyToOne(() => DepartmentEntity, { onDelete: 'NO ACTION' })
  department?: DepartmentEntity;

  @RelationId((doctor: DoctorEntity) => doctor.department)
  departmentId?: number;

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;
}
