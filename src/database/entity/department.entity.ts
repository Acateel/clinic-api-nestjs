import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
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

  @RelationId((department: DepartmentEntity) => department.parentDepartment)
  parentDepartmentId?: number;

  @OneToMany(() => DoctorEntity, (doctor) => doctor.department)
  doctors?: DoctorEntity[];

  @CreateDateColumn({ select: false, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ select: false, type: 'timestamptz' })
  updatedAt?: Date;
}
