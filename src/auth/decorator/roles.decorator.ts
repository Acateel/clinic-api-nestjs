import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/common/enum';

export const Roles = (...roles: UserRoleEnum[]) => SetMetadata('ROLES', roles);
