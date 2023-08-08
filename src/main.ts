import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as classValidator from 'class-validator';
import { EnvironmentEnum } from './common/enum';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  app.useGlobalGuards(new AuthGuard(app.get(Reflector), app.get(JwtService)));
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('clinic-api-nestjs')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = app.get(ConfigService).get(EnvironmentEnum.PORT);
  await app.listen(port);
}
bootstrap();
