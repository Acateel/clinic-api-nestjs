import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete,
  Request,
  UseGuards,
  SetMetadata,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticatedRequest, ReadOptions } from 'src/common/interface';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/createPatient.dto';
import { MetadataEnum, RoleEnum } from 'src/common/enum';
import { UserEntity } from 'src/database/entity/user.entity';
import { UpdatePatientDto } from './dto/updatePatient.dto';
import { ForbidOtherUserDataResponse } from 'src/common/decorator/forbidOtherUserDataAccess.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PatientResponseDto } from './dto/response/patientResponse.dto';
import { PatientDetailsResponseDto } from './dto/response/patientDetailsResponse.dto';

@Controller('patients')
@ApiTags('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [RoleEnum.ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PatientResponseDto })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreatePatientDto) {
    return this.patientService.create(req.user.sub, dto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [
    RoleEnum.ADMIN,
    RoleEnum.DOCTOR,
    RoleEnum.PATIENT,
  ])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientResponseDto })
  get(@Query() query: ReadOptions<UserEntity>) {
    return this.patientService.get(query.find);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [
    RoleEnum.ADMIN,
    RoleEnum.DOCTOR,
    RoleEnum.PATIENT,
  ])
  @ForbidOtherUserDataResponse(RoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientDetailsResponseDto })
  getById(@Param('id') id: number) {
    return this.patientService.getById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [RoleEnum.ADMIN, RoleEnum.PATIENT])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [RoleEnum.ADMIN, RoleEnum.PATIENT])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, patient' })
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('id') id: number) {
    return this.patientService.delete(id);
  }
}
