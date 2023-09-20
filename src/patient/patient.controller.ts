import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AccessTokenPayload } from 'src/common/interface';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UserRoleEnum } from 'src/common/enum';
import { UpdatePatientDto } from './dto/updatePatient.dto';
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
import { User } from 'src/common/decorator/user.decorator';

@Controller('patients')
@ApiTags('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PatientResponseDto })
  create(@Body() dto: CreatePatientDto, @User() user: AccessTokenPayload) {
    return this.patientService.create(dto, user);
  }

  @Get()
  @UseGuards(
    AuthGuard,
    new RolesGuard(
      UserRoleEnum.ADMIN,
      UserRoleEnum.DOCTOR,
      UserRoleEnum.PATIENT,
    ),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: [PatientResponseDto] })
  get(@Query() query) {
    return this.patientService.get(query);
  }

  @Get(':id')
  @UseGuards(
    AuthGuard,
    new RolesGuard(
      UserRoleEnum.ADMIN,
      UserRoleEnum.DOCTOR,
      UserRoleEnum.PATIENT,
    ),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientDetailsResponseDto })
  getById(@Param('id') id: number, @User() user: AccessTokenPayload) {
    return this.patientService.getById(id, user);
  }

  @Patch(':id')
  @UseGuards(
    AuthGuard,
    new RolesGuard(UserRoleEnum.ADMIN, UserRoleEnum.PATIENT),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: PatientResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdatePatientDto) {
    return this.patientService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(
    AuthGuard,
    new RolesGuard(UserRoleEnum.ADMIN, UserRoleEnum.PATIENT),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, patient' })
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('id') id: number) {
    return this.patientService.delete(id);
  }
}
