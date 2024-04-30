import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { I18nContext, I18nService } from 'nestjs-i18n';
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
    private readonly i18n: I18nService,
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
      path.join(this.templatesPath, `${templateName}.hbs`),
      'utf8',
    );

    handlebars.registerHelper('t', (str) =>
      this.i18n != undefined
        ? this.i18n.t(`${templateName}.${str}`, {
            lang: I18nContext.current()?.lang,
          })
        : str,
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
