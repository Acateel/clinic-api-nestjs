import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfigFactory } from './app-config-factory';
import { AppConfigValidator } from './app-config-validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfigFactory],
      validate: AppConfigValidator.validate,
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
