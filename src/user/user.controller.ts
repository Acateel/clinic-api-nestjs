import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { CreateUserDto } from './dto/create-user.dto';
import { UserDetailsResponseDto } from './dto/response/user-details-response.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.OK, type: [UserResponseDto] })
  get() {
    return this.userService.get();
  }

  @Get('profile')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDetailsResponseDto })
  getProfile(@User() user: AccessTokenPayload) {
    return this.userService.getById(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDetailsResponseDto })
  getById(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, new RolesGuard(UserRoleEnum.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin' })
  @ApiResponse({ status: HttpStatus.OK })
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
