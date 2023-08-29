import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { DatabaseModule } from 'src/database/database.module';
import { RoleEnum } from 'src/common/enum';
import * as classValidator from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { TestDatabaseModule } from 'src/database/testDatabase.module';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from 'src/app/config/jwt.config';
import { testDatabaseConfig } from 'src/app/config/testDatabase.config';
import { serverConfig } from 'src/app/config/server.config';
import { validate } from '../src/app/config/appConfigValidation';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .overrideModule(ConfigModule)
      .useModule(
        ConfigModule.forRoot({
          load: [jwtConfig, testDatabaseConfig, serverConfig],
          validate,
        }),
      )
      .compile();

    app = moduleFixture.createNestApplication();

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

    await app.init();
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send({
        email: '100012dw32c@gmail.com',
        fullName: 'Meme',
        password: '123',
        role: RoleEnum.ADMIN,
      })
      .expect(201);
  });
});
