import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { Transporter } from 'nodemailer';
import * as path from 'path';
import { SMTP_TRANSPORTER } from 'src/common/constant';
import { AppConfig } from 'src/common/interface';

@Injectable()
export class EmailService {
  private readonly templatesPath;

  constructor(
    @Inject(SMTP_TRANSPORTER) private readonly transporter: Transporter,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {
    this.templatesPath = this.configService.get('smtp.templatesPath', {
      infer: true,
    });
  }

  async send(
    to: string,
    subject: string,
    templateName: string,
    templateData: object,
  ): Promise<void> {
    const template = fs.readFileSync(
      path.join(this.templatesPath, templateName),
      'utf8',
    );

    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate(templateData);

    await this.transporter.sendMail({
      from: this.configService.get('smtp.auth.user', { infer: true }),
      to,
      subject,
      html,
    });
  }
}
