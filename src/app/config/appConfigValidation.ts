import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, validateSync } from 'class-validator';

class EnvironmentConfig {
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
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentConfig, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
