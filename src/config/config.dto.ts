import { IsNotEmpty, IsNumber } from 'class-validator';

export class EnvironmentConfigDto {
  @IsNumber()
  PORT!: number;

  @IsNumber()
  PGPORT!: number;

  @IsNotEmpty()
  PGUSER!: string;

  @IsNotEmpty()
  PGPASSWORD!: string;

  @IsNotEmpty()
  PGHOST!: string;

  @IsNotEmpty()
  PGDATABASE!: string;

  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsNotEmpty()
  PGTEST_DATABASE!: string;
}
