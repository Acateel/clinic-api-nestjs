import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class GetDoctorAppointmentsQueryDto {
  @ApiProperty({
    example: '2023-08-01',
    description:
      'Дата начала периода в формате UTC. Можно без уточнения времени.',
  })
  @IsOptional()
  @IsDate()
  readonly fromDate?: Date;

  @ApiProperty({
    example: '2023-09-01',
    description:
      'Дата окончания периода в формате UTC. Можно без уточнения времени.',
  })
  @IsOptional()
  @IsDate()
  readonly toDate?: Date;

  @ApiProperty({
    example: [1, 2],
    description: 'Айди департаментов для включения в расчет.',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.toString().split(',').map(Number))
  readonly filterDepartmentIds?: number[];

  @ApiProperty({
    description: 'Включить департаменты без данных в расчет.',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => String)
  @Transform(({ value }) => value === 'true')
  readonly isIncludeEmptyValues?: boolean;
}
