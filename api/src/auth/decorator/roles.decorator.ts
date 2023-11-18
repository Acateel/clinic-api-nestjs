import { SetMetadata } from '@nestjs/common';
import { MetadataKeyEnum, UserRoleEnum } from 'src/common/enum';

export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(MetadataKeyEnum.ROLES, roles);
