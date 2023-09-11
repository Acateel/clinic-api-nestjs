import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import * as classValidator from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

// REVIEW:
// dotenv.config({ path: '.env.testing', override: true });

describe('App (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

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

    dataSource = await app.resolve(getDataSourceToken());

    await dataSource.dropDatabase();
    await dataSource.synchronize();
    await dataSource.runMigrations();

    await app.init();
  });

  afterEach(async () => {
    await dataSource.dropDatabase();
  });

  describe('Users', () => {
    const user = {
      email: 'test@example.com',
      password: 'test',
      fullName: 'Name Surname',
      role: 'ADMIN',
    };

    describe('when unauthorized', () => {
      describe('/POST users', () => {
        it(`should return response with status of ${HttpStatus.UNAUTHORIZED}`, async () => {
          const response = await request(app.getHttpServer()).post('/users');

          expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('/GET users', () => {
        it(`should return response with status of ${HttpStatus.UNAUTHORIZED}`, async () => {
          const response = await request(app.getHttpServer()).get('/users');

          expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('/GET users/profile', () => {
        it(`should return response with status of ${HttpStatus.UNAUTHORIZED}`, async () => {
          const response = await request(app.getHttpServer()).get(
            '/users/profile',
          );

          expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('/GET users/:id', () => {
        const id = 1;
        it(`should return response with status of ${HttpStatus.UNAUTHORIZED}`, async () => {
          const response = await request(app.getHttpServer()).get(
            `/users/${id}`,
          );

          expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('/PATCH users/:id', () => {
        const id = 1;
        it(`should return response with status of ${HttpStatus.UNAUTHORIZED}`, async () => {
          const response = await request(app.getHttpServer()).patch(
            `/users/${id}`,
          );

          expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
      });

      describe('/DELETE users/:id', () => {
        const id = 1;
        it(`should return response with status of ${HttpStatus.UNAUTHORIZED}`, async () => {
          const response = await request(app.getHttpServer()).delete(
            `/users/${id}`,
          );

          expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
      });
    });

    describe('when authorized as ADMIN', () => {
      const adminUserCredentials = {
        email: 'admin@test.com',
        password: 'test',
      };
      let accessToken;

      beforeEach(async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(adminUserCredentials);
        accessToken = res.body.access_token;
      });

      test('access_token should be recieved', () => {
        expect(accessToken).toBeDefined();
      });

      describe('/POST users', () => {
        it(`should return ${HttpStatus.BAD_REQUEST} when no fullName provided`, async () => {
          const requestWithoutFullName = {
            email: 'test@example.com',
            password: 'test',
          };
          const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(requestWithoutFullName);

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it(`should return ${HttpStatus.BAD_REQUEST} when invalid email`, async () => {
          const requestWithoutFullName = {
            email: 'invalid.com',
            password: 'test',
            fullName: 'A B',
          };
          const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(requestWithoutFullName);

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it(`should return ${HttpStatus.BAD_REQUEST} when email allready in use`, async () => {
          const credantialsWithSameEmail = {
            email: 'same@mail.com',
            password: 'test',
            fullName: 'A B',
          };
          await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(credantialsWithSameEmail);
          const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(credantialsWithSameEmail);

          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it(`should return ${HttpStatus.CREATED} for valid request`, async () => {
          const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', 'Bearer ' + accessToken)
            .send(user);

          expect(response.status).toBe(HttpStatus.CREATED);
        });
      });
      // TODO: not complete test cases for users
    });

    describe('when authorized with other role', () => {
      const userCredentials = {
        email: 'guest@test.com',
        password: 'test',
        fullName: 'User Name',
      };
      let accessToken;

      beforeEach(async () => {
        // TODO: BeforeEach duplicates
        const res = await request(app.getHttpServer())
          .post('/auth/register')
          .send(userCredentials);
        accessToken = res.body.access_token;
      });

      test('access_token should be recieved', () => {
        expect(accessToken).toBeDefined();
      });

      describe('/POST users', () => {
        it(`should return response with status of ${HttpStatus.FORBIDDEN}`, async () => {
          const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', 'Bearer ' + accessToken);

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      });

      describe('/GET users', () => {
        it(`should return response with status of ${HttpStatus.FORBIDDEN}`, async () => {
          const response = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', 'Bearer ' + accessToken);

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      });

      describe('/GET users/profile', () => {
        it(`should return response with status of ${HttpStatus.FORBIDDEN}`, async () => {
          const response = await request(app.getHttpServer())
            .get('/users/profile')
            .set('Authorization', 'Bearer ' + accessToken);

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      });

      describe('/GET users/:id', () => {
        it(`should return response with status of ${HttpStatus.FORBIDDEN}`, async () => {
          const id = 1;
          const response = await request(app.getHttpServer())
            .get(`/users/${id}`)
            .set('Authorization', 'Bearer ' + accessToken);

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      });

      describe('/PATCH users/:id', () => {
        it(`should return response with status of ${HttpStatus.FORBIDDEN}`, async () => {
          const id = 1;
          const response = await request(app.getHttpServer())
            .patch(`/users/${id}`)
            .set('Authorization', 'Bearer ' + accessToken);

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      });

      describe('/DELETE users/:id', () => {
        it(`should return response with status of ${HttpStatus.FORBIDDEN}`, async () => {
          const id = 1;
          const response = await request(app.getHttpServer())
            .delete(`/users/${id}`)
            .set('Authorization', 'Bearer ' + accessToken);

          expect(response.status).toBe(HttpStatus.FORBIDDEN);
        });
      });
    });
  });

  describe('Appointment', () => {
    describe('When authorized', () => {
      // TODO: repeats
      const userCredentials = {
        email: 'guest@test.com',
        password: 'test',
        fullName: 'User Name',
        role: 'ADMIN',
      };
      let accessToken;

      beforeEach(async () => {
        // TODO: BeforeEach duplicates
        const res = await request(app.getHttpServer())
          .post('/auth/register')
          .send(userCredentials);
        accessToken = res.body.access_token;
      });

      describe('/POST appointments', () => {
        it(`should return response with status of ${HttpStatus.CONFLICT} when doctor unavailable`, async () => {
          const startDate = '2024-01-14T12:00:00.000Z';
          const endDate = '2024-01-14T13:00:00.000Z';

          const doctorResponse = await request(app.getHttpServer())
            .post(`/doctors`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              speciality: 'Dentist',
              availableSlots: [],
            });

          const patientResponse = await request(app.getHttpServer())
            .post(`/patients`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              phoneNumber: '+380990000000',
            });

          const response = await request(app.getHttpServer())
            .post(`/appointments`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              doctorId: doctorResponse.body.id,
              patientId: patientResponse.body.id,
              startDate,
              endDate,
            });

          expect(response.status).toBe(HttpStatus.CONFLICT);
        });

        it(`should return response with status of ${HttpStatus.CREATED} when doctor available`, async () => {
          const startDate = '2024-01-14T12:00:00.000Z';
          const endDate = '2024-01-14T13:00:00.000Z';

          const doctorResponse = await request(app.getHttpServer())
            .post(`/doctors`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              speciality: 'Dentist',
              availableSlots: [{ startDate, endDate }],
            });

          const patientResponse = await request(app.getHttpServer())
            .post(`/patients`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              phoneNumber: '+380990000000',
            });

          const response = await request(app.getHttpServer())
            .post(`/appointments`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              doctorId: doctorResponse.body.id,
              patientId: patientResponse.body.id,
              startDate,
              endDate,
            });

          expect(response.status).toBe(HttpStatus.CREATED);
        });

        it(`should take doctor available slot after appointment created`, async () => {
          const startDate = '2024-01-14T12:00:00.000Z';
          const endDate = '2024-01-14T13:00:00.000Z';

          const doctorResponse = await request(app.getHttpServer())
            .post(`/doctors`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              speciality: 'Dentist',
              availableSlots: [],
            });

          const patientResponse = await request(app.getHttpServer())
            .post(`/patients`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              phoneNumber: '+380990000000',
            });

          await request(app.getHttpServer())
            .post(`/appointments`)
            .set('Authorization', 'Bearer ' + accessToken)
            .send({
              doctorId: doctorResponse.body.id,
              patientId: patientResponse.body.id,
              startDate,
              endDate,
            });

          const response = await request(app.getHttpServer())
            .get(`/doctors/${doctorResponse.body.id}`)
            .set('Authorization', 'Bearer ' + accessToken);

          expect(response.body.availableSlots.length).toBe(0);
        });
      });
    });
  });
});
