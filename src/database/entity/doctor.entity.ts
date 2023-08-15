import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AppointmentEntity } from './appointment.entity';

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

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  appointments?: AppointmentEntity[];

  @RelationId((doctor: DoctorEntity) => doctor.appointments)
  appointmentIds!: string;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;
}
