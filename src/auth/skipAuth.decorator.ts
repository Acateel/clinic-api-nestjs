import { SetMetadata } from '@nestjs/common';
import { MetadataEnum } from 'src/common/enum';

export const SkipAuth = () => SetMetadata(MetadataEnum.PUBLIC_ENDPOINT, true);
