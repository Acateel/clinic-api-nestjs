import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from 'src/common/decorator/user.decorator';
import { UserRoleEnum } from 'src/common/enum';
import { AccessTokenPayload } from 'src/common/interface';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { InviteDoctorDto } from './dto/invite-doctor.dto';
import { DoctorDetailsResponseDto } from './dto/response/doctor-details-response.dto';
import { DoctorResponseDto } from './dto/response/doctor-response.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
@ApiTags('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: DoctorResponseDto })
  create(@Body() dto: CreateDoctorDto, @User() user: AccessTokenPayload) {
    return this.doctorService.create(dto, user);
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
  @ApiResponse({ status: HttpStatus.OK, type: [DoctorResponseDto] })
  get(@Query() query) {
    return this.doctorService.get(query);
  }

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.OK })
  invite(@Body() dto: InviteDoctorDto) {
    return this.doctorService.invite(dto);
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
