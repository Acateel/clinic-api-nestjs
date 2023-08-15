import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/createDoctor.dto';
import { DoctorService } from './doctor.service';
import { AuthenticatedRequest, ReadOptions } from 'src/common/interface';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { MetadataEnum, RoleEnum } from 'src/common/enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DoctorResponseDto } from './dto/response/doctorResponse.dto';
import { DoctorEntity } from 'src/database/entity/doctor.entity';
import { ForbidOtherUserDataResponse } from 'src/common/decorator/forbidOtherUserDataAccess.decorator';
import { DoctorDetailsResponseDto } from './dto/response/doctorDetailsResponse.dto';
import { UpdateDoctorDto } from './dto/updateDoctor.dto';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [RoleEnum.ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: DoctorResponseDto })
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateDoctorDto) {
    return this.doctorService.create(req.user.sub, dto);
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
  @ApiResponse({ status: HttpStatus.OK, type: DoctorResponseDto })
  get(@Query() query: ReadOptions<DoctorEntity>) {
    return this.doctorService.get(query.find);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [
    RoleEnum.ADMIN,
    RoleEnum.DOCTOR,
    RoleEnum.PATIENT,
  ])
  @ForbidOtherUserDataResponse(RoleEnum.PATIENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor, patient' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorDetailsResponseDto })
  getById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.doctorService.getById(uuid);
  }

  @Put(':uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [RoleEnum.ADMIN, RoleEnum.DOCTOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor' })
  @ApiResponse({ status: HttpStatus.OK, type: DoctorResponseDto })
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateDoctorDto,
  ) {
    return this.doctorService.update(uuid, dto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata(MetadataEnum.ROLES, [RoleEnum.ADMIN, RoleEnum.DOCTOR])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin, doctor' })
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.doctorService.delete(uuid);
  }
}
