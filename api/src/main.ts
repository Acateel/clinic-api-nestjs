import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as classValidator from 'class-validator';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
import { AppConfig } from './common/interface';
import { ServeStaticExceptionFilter } from './file/exception-filter/serve-static-exception.filter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ServeStaticExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  classValidator.useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors();

  setupSwagger(app);

  const port = app.get(ConfigService<AppConfig, true>).get('port');

  await app.listen(port);
}
bootstrap();
