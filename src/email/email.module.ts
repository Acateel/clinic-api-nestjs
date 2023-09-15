import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service';
import { AppConfig } from 'src/common/interface';
import { ConfigService } from '@nestjs/config';
import { SMTP_TRANSPORTER } from 'src/common/constant';

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
