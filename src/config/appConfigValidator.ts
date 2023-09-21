import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfigDto } from './appConfig.dto';

export class AppConfigValidator {
  static validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(AppConfigDto, config, {
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
}
