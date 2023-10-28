import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('department')
export class DepartmentEntity {
  @PrimaryGeneratedColumn({ name: 'department_id' })
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => DepartmentEntity, { nullable: true })
  parentDepartment?: DepartmentEntity;

  @OneToMany(
    () => DepartmentEntity,
    (department) => department.parentDepartment,
  )
  childDepartments?: DepartmentEntity[];

  @Column({ nullable: true })
  parentDepartmentId?: number;

  @ManyToMany(() => DoctorEntity, (doctor) => doctor.departments, {
    onDelete: 'SET NULL',
  })
  doctors?: DoctorEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
