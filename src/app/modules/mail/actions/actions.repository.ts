import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';
import { IMailRepository } from '../repositories/mail.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from '../dtos';

@Injectable()
export class MailActionsRepository implements IMailRepository {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendMail({
    email,
    name,
    token,
    expiresIn,
  }: SendMailDto): Promise<void> {
    const template = this.getTemplate();

    const htmlToSend = template({
      title: 'Bem-vindo!',
      username: name,
      message:
        'Você acabou de ser cadastrado como usuário em nossa plataforma!',
      description: 'Clique no botão abaixo para definir sua senha de acesso.',
      buttonText: 'Definir senha',
      urlButton: this.configService.get('CREATE_PASSWORD_URL').concat(token),
      expirationToken: expiresIn,
    });

    const response = await this.mailerService.sendMail({
      to: email,
      subject: 'Definir Senha',
      html: htmlToSend,
      headers: {
        ['Authorization']: this.configService.get('MAIL_TOKEN'),
      },
    });

    console.log('E-mail enviado: ', response);
  }

  private getTemplate() {
    return handlebars.compile(`
            <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                text-align: center;
                                font-family: "Poppins", sans-serif;
                                font-size: 14px;
                                length: 100%;
                            }
                            .container {
                                max-width: 500px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 48px;
                            }
                            h2 {
                                font-size: 24px;
                                margin-top: 48px;
                                text-align: center;
                            }
                            p {
                                line-height: 21px;
                                text-align: center;
                            }
                            .center {
                                width: 100%;
                                text-align: center;
                            }
                            .button {
                                display: inline-block;
                                margin-top: 10px;
                                padding: 8px 32px;
                                text-decoration: none;
                                background-color: #8B6DD7;
                                color: #FFF !important;
                                border-radius: 6px;
                                font-weight: bold;
                                text-align: center;
                            }
                            .button:hover {
                                background-color: #624F96;
                            }
                            .linkExpiration {
                                margin-top: 24px;
                                color: #5a646e;
                            }
                            .footer {
                                margin-top: 24px;
                                color: #313B56;
                                font-weight: 600;
                            }
                        </style>
                    </head>
                <body>
                    <div class="container center">
                        <div class="center">
                            <img src="https://fromsmash.com/training-track" class="logo" alt="logo da empresa" />
                        </div>
                        <h2>{{ title }}</h2>
                        <p>Olá {{ username }},</p>
                        <p>{{ message }}</p>
                        <p>{{ description }}</p>
                        <div class="center">
                            <a href="{{ urlButton }}" class="button">{{ buttonText }}</a>
                        </div>
                        <p class="linkExpiration">
                            Link válido por {{ expirationToken }}h. Em caso de dúvida contate o suporte.
                        </p>
                        <p class="footer">Obrigado,<br />Training Track.</p>
                    </div>
                </body>
            </html>`);
  }
}
