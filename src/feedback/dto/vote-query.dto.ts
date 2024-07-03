import { IsEnum } from 'class-validator';
import { VoteTypeEnum } from 'src/common/enum';

export class VoteQueryDto {
  @IsEnum(VoteTypeEnum)
  type!: VoteTypeEnum;
}
