import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UserRoleEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientService } from './patient.service';
import { PatientDetailsResponseDto } from './response-dto/patient-details-response.dto';
import { PatientResponseDto } from './response-dto/patient-response.dto';

@Controller('patients')
@ApiTags('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PatientResponseDto })
  create(@Body() dto: CreatePatientDto, @User() user: AccessTokenPayload) {
    return this.patientService.create(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: [PatientResponseDto] })
  get(@Query() query) {
    return this.patientService.get(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientDetailsResponseDto })
  getById(@Param('id') id: number, @User() user: AccessTokenPayload) {
    return this.patientService.getById(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, patient' })
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('id') id: number) {
    return this.patientService.delete(id);
  }
}
