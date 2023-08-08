import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { MetadataEnum, RoleEnum } from '../enum';
import { RestrictResponseEntityToOwnUserInterceptor } from '../interceptor/RestrictResponseEntityToOwnUser.interceptor';

export const ForbidOtherUserDataResponse = (ownRole: RoleEnum) =>
  applyDecorators(
    SetMetadata(MetadataEnum.OWN_ROLE, ownRole),
    UseInterceptors(RestrictResponseEntityToOwnUserInterceptor),
  );
