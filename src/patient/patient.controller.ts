import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Delete,
  Request,
} from '@nestjs/common';
import { AuthenticatedRequest, ReadOptions } from 'src/common/interface';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/createPatient.dto';
import { RoleEnum } from 'src/common/enum';
import { Roles } from 'src/auth/roles.decorator';
import { UserEntity } from 'src/user/user.entity';
import { UpdatePatientDto } from './dto/updatePatient.dto';
import { ForbidOtherUserDataResponse } from 'src/common/decorator/forbidOtherUserDataAccess.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreatePatientDto) {
    return this.patientService.create(req.user.sub, dto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT)
  read(@Query() query: ReadOptions<UserEntity>) {
    return this.patientService.read(query.find);
  }

  @Get(':uuid')
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT)
  @ForbidOtherUserDataResponse(RoleEnum.PATIENT)
  readById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.patientService.readById(uuid);
  }

  @Put(':uuid')
  @Roles(RoleEnum.ADMIN, RoleEnum.PATIENT)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Roles(RoleEnum.ADMIN, RoleEnum.PATIENT)
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.patientService.delete(uuid);
  }
}
