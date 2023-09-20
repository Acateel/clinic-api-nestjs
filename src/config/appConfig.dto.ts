import { IsNotEmpty } from 'class-validator';

export class AppConfigDto {
  @IsNotEmpty()
  readonly PORT;

  @IsNotEmpty()
  readonly DB_USER;

  @IsNotEmpty()
  readonly DB_NAME;

  @IsNotEmpty()
  readonly DB_PASSWORD;

  @IsNotEmpty()
  readonly DB_HOST;

  @IsNotEmpty()
  readonly DB_PORT;

  @IsNotEmpty()
  readonly ENTITIES;

  @IsNotEmpty()
  readonly MIGRATIONS;

  @IsNotEmpty()
  readonly SYNCHRONIZE;

  @IsNotEmpty()
  readonly ACCESS_SECRET;

  @IsNotEmpty()
  readonly ACCESS_LIFETIME;

  @IsNotEmpty()
  readonly REFRESH_SECRET;

  @IsNotEmpty()
  readonly REFRESH_LIFETIME;

  @IsNotEmpty()
  readonly INVITE_SECRET;

  @IsNotEmpty()
  readonly INVITE_LIFETIME;

  @IsNotEmpty()
  readonly API_URL;

  @IsNotEmpty()
  readonly SMTP_HOST;

  @IsNotEmpty()
  readonly SMTP_PORT;

  @IsNotEmpty()
  readonly SMTP_USER;

  @IsNotEmpty()
  readonly SMTP_PASSWORD;
}
