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
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { AuthenticatedRequest, ReadOptions } from 'src/common/interface';
import { UserEntity } from '../database/entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/common/enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@Roles(RoleEnum.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  get(@Query() query: ReadOptions<UserEntity>) {
    return this.userService.get(query.find);
  }

  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get(':uuid')
  getById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getById(uuid);
  }

  @Put(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(uuid, dto);
  }

  @Delete(':uuid')
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    this.userService.delete(uuid);
  }
}
