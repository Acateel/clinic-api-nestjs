import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from 'src/database/entity/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const department = new DepartmentEntity();
    department.name = dto.name;

    if (dto.parentDepartmentId) {
      const parentDepartment = await this.departmentRepository.findOneBy({
        id: dto.parentDepartmentId,
      });

      if (!parentDepartment) {
        throw new NotFoundException('Department not found');
      }

      department.parentDepartment = parentDepartment;
    }

    const createdDepartment = await this.departmentRepository.save(department);

    return this.departmentRepository.findOneBy({ id: createdDepartment.id });
  }

  get() {
    return this.departmentRepository.find();
  }

  async getDepartmentsHierarchy() {
    const departments = await this.departmentRepository.find({
      relations: { doctors: { user: true } },
    });

    const buildHierarchy = async (
      departments: DepartmentEntity[],
      parentDepartmentId: number | null = null,
    ) => {
      const departmentsWithChildren: DepartmentEntity[] = [];

      for (const department of departments) {
        if (department.parentDepartmentId === parentDepartmentId) {
          const departmentWithChildren: DepartmentEntity = {
            ...department,
            childDepartments: await buildHierarchy(departments, department.id),
          };
          const isLastInHierarchy =
            departmentWithChildren.childDepartments?.length === 0;

          if (!isLastInHierarchy) {
            delete departmentWithChildren.doctors;
          }

          departmentsWithChildren.push(departmentWithChildren);
        }
      }
      return departmentsWithChildren;
    };

    return buildHierarchy(departments);
  }
}
