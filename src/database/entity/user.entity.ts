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
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password?: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.GUEST })
  role!: RoleEnum;

  @Column()
  firstName!: string;

  @Column({ type: String, select: false, nullable: true })
  resetToken?: string | null;

  @OneToMany(() => PatientEntity, (patient) => patient.user)
  patients?: PatientEntity[];

  @RelationId((user: UserEntity) => user.patients)
  patientIds!: string[];

  @OneToMany(() => DoctorEntity, (doctor) => doctor.user)
  doctors?: DoctorEntity[];

  @RelationId((user: UserEntity) => user.patients)
  doctorIds!: string[];

  @CreateDateColumn({ select: false })
  createdAt?: Date;
}
