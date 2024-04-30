import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
