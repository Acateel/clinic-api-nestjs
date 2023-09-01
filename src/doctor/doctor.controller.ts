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
import { RoleEnum } from 'src/common/enum';
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

@Controller('doctors')
@ApiTags('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseGuards(AuthGuard, new RolesGuard(RoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: DoctorResponseDto })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateDoctorDto) {
    return this.doctorService.create(req.user.sub, dto);
  }

  @Get()
  @UseGuards(
    AuthGuard,
    new RolesGuard(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorResponseDto })
  get(@Query() query: ReadOptions<DoctorEntity>) {
    return this.doctorService.get(query.find);
  }

  @Get(':id')
  @UseGuards(
    AuthGuard,
    new RolesGuard(RoleEnum.ADMIN, RoleEnum.DOCTOR, RoleEnum.PATIENT),
  )
  @UseInterceptors(
    new CheckResponseEntityOwnershipByAuthorizedUserInterceptor(
      RoleEnum.DOCTOR,
    ),
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorDetailsResponseDto })
  getById(@Param('id') id: number) {
    return this.doctorService.getById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, new RolesGuard(RoleEnum.ADMIN, RoleEnum.DOCTOR))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, new RolesGuard(RoleEnum.ADMIN, RoleEnum.DOCTOR))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor' })
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('id') id: number) {
    return this.doctorService.delete(id);
  }
}
