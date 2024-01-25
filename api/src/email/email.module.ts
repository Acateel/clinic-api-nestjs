import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SMTP_TRANSPORTER } from 'src/common/constant';
import { AppConfig } from 'src/common/interface';
import { EmailService } from './email.service';

@Module({
  providers: [
    {
      provide: SMTP_TRANSPORTER,
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        nodemailer.createTransport(configService.get('smtp')),
      inject: [ConfigService],
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
