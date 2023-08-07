export enum EnvironmentEnum {
  PORT = 'PORT',

  DB_USER = 'PGUSER',
  DB_PASSWORD = 'PGPASSWORD',
  DB_NAME = 'PGDATABASE',
  DB_HOST = 'PGHOST',
  DB_PORT = 'PGPORT',

  ACCESS_SECRET = 'JWT_ACCESS_SECRET',
}

export enum UserRoleEnum {
  GUEST = 'GUEST',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN',
}

export enum TokenLifetimeEnum {
  ACCESS = '1D',
}

export enum ProviderEnum {
  APP_GUARD = 'APP_GUARD',
}

export enum MetadataEnum {
  PUBLIC_ENDPOINT = 'PUBLIC_ENDPOINT',
}
