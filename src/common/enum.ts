export enum EnvironmentEnum {
  PORT = 'PORT',

  DB_USER = 'PGUSER',
  DB_PASSWORD = 'PGPASSWORD',
  DB_NAME = 'PGDATABASE',
  DB_HOST = 'PGHOST',
  DB_PORT = 'PGPORT',

  ACCESS_SECRET = 'JWT_ACCESS_SECRET',
}

export enum RoleEnum {
  GUEST = 'GUEST',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN',
}

export enum TokenLifetimeEnum {
  ACCESS = '1D',
}

export enum MetadataEnum {
  PUBLIC_ENDPOINT = 'PUBLIC_ENDPOINT',
  ROLES = 'ROLES',
  OWN_ROLE = 'OWN_ROLE',
}
