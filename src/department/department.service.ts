import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from 'src/database/entity/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity) private readonly departmentRepository,
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

      department.parent_department = parentDepartment;
    }

    const createdDepartment = await this.departmentRepository.save(department);

    return this.departmentRepository.findOneBy({ id: createdDepartment.id });
  }
}
