import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfigFactory } from './appConfigFactory';
import { AppConfigValidationService } from './appConfigValidation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfigFactory],
      validate: AppConfigValidationService.validate,
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
