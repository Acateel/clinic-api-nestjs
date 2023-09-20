import { Injectable, Inject } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { SMTP_TRANSPORTER } from 'src/common/constant';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/common/interface';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService<AppConfig, true>,
    @Inject(SMTP_TRANSPORTER) private readonly transporter: Transporter,
  ) {}

  async sendInvite(to: string, inviteLink: string) {
    const template = fs.readFileSync(
      path.join(__dirname, 'template', 'invite.hbs'),
      'utf8',
    );

    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ inviteLink });

    const mailOptions = {
      from: this.configService.get('smtp.auth.user', { infer: true }),
      to,
      subject: 'Invite mail',
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
