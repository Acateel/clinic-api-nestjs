import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
    orphanedRowAction: 'delete',
  })
  doctor?: DoctorEntity;
}
