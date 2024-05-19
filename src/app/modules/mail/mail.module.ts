import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailActionsRepository } from './actions/actions.repository';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: process.env.MAIL_AUTH,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" ${process.env.MAIL_AUTH}`,
      },
    }),
  ],
  providers: [
    {
      provide: 'IMailRepository',
      useClass: MailActionsRepository,
    },
  ],
  exports: ['IMailRepository'],
})
export class MailModule {}
