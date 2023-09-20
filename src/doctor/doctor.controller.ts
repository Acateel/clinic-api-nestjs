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
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { DoctorService } from './doctor.service';
import { AccessTokenPayload } from 'src/common/interface';
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
import { DoctorDetailsResponseDto } from './dto/response/doctorDetailsResponse.dto';
import { UpdateDoctorDto } from './dto/updateDoctor.dto';
import { InviteDoctorDto } from './dto/inviteDoctor.dto';
import { User } from 'src/common/decorator/user.decorator';

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
