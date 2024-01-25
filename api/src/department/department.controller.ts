import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Controller('departments')
@ApiTags('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Get()
  get() {
    return this.departmentService.get();
  }

  @Get('list/hierarchy')
  getDepartmentsHierarchy() {
    return this.departmentService.getDepartmentsHierarchy();
  }
}
