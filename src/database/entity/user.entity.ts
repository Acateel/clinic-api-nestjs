import { RoleEnum } from 'src/common/enum';
import { PatientEntity } from 'src/database/entity/patient.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  RelationId,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password?: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  role!: RoleEnum;

  @Column()
  fullName!: string;

  @Column({ type: String, select: false, nullable: true })
  resetToken?: string | null;

  @OneToMany(() => PatientEntity, (patient) => patient.user)
  patients?: PatientEntity[];

  @RelationId((user: UserEntity) => user.patients)
  patientIds!: number[];

  @OneToMany(() => DoctorEntity, (doctor) => doctor.user)
  doctors?: DoctorEntity[];

  @RelationId((user: UserEntity) => user.patients)
  doctorIds!: number[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;
}
