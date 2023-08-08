import { SetMetadata } from '@nestjs/common';
import { MetadataEnum, RoleEnum } from 'src/common/enum';

export const Roles = (...roles: RoleEnum[]) =>
  SetMetadata(MetadataEnum.ROLES, roles);
