import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AppointmentEntity } from './appointment.entity';

@Entity('doctor')
export class DoctorEntity {
  @PrimaryGeneratedColumn({ name: 'doctor_id' })
  id!: number;

  @Column()
  speciality!: string;

  @Column({
    type: 'timestamp',
    array: true,
  })
  availableSlots!: Date[];

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  user?: UserEntity;

  @RelationId((doctor: DoctorEntity) => doctor.user)
  userId!: number;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  appointments?: AppointmentEntity[];

  @RelationId((doctor: DoctorEntity) => doctor.appointments)
  appointmentIds!: number[];

  @CreateDateColumn({ select: false })
  createdAt?: Date;
}
