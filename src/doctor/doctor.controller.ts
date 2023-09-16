import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { DoctorService } from './doctor.service';
import { AuthenticatedRequest, ReadOptions } from 'src/common/interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/common/enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DoctorResponseDto } from './dto/response/doctorResponse.dto';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { DoctorDetailsResponseDto } from './dto/response/doctorDetailsResponse.dto';
import { UpdateDoctorDto } from './dto/updateDoctor.dto';
import { CheckResponseEntityOwnershipByAuthorizedUserInterceptor } from 'src/common/interceptor/checkResponseEntityOwnershipByAuthorizedUser.interceptor';
import { InviteDoctorDto } from './dto/inviteDoctor.dto';
import { UpdateDoctorProfileDto } from './dto/updateDoctorProfile.dto';

@Controller('doctors')
@ApiTags('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: DoctorResponseDto })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateDoctorDto) {
    return this.doctorService.create(req.user.id, dto);
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
  @ApiResponse({ status: HttpStatus.OK, type: DoctorResponseDto })
  get(@Query() query: ReadOptions<DoctorEntity>) {
    return this.doctorService.get(query.find);
  }

  @Post('invite')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.OK })
  invite(@Body() dto: InviteDoctorDto) {
    return this.doctorService.invite(dto);
  }

  @Patch('profile')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorResponseDto })
  updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateDoctorProfileDto,
  ) {
    return this.doctorService.updateProfile(req.user.id, dto);
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
  @UseInterceptors(
    new CheckResponseEntityOwnershipByAuthorizedUserInterceptor(
      UserRoleEnum.DOCTOR,
    ),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorDetailsResponseDto })
  getById(@Param('id') id: number) {
    return this.doctorService.getById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN, UserRoleEnum.DOCTOR))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor' })
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('id') id: number) {
    return this.doctorService.delete(id);
  }
}
