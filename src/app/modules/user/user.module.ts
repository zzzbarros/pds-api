import { Module, forwardRef } from '@nestjs/common';
import { CreateUserUseCase } from './usecases';
import { SendMailJob } from './jobs';
import { UserController } from './controllers';
import { QueueModule } from '../queues/queue.module';
import { MailModule } from '../mail/mail.module';
import { SecurityModule } from 'src/infra/security/security.module';
import { UserPostgresRepository } from 'src/infra/databases/orms/prisma/postgres';
import { CreateTokenSendMailListener } from './listeners';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    QueueModule,
    MailModule,
    forwardRef(() => AuthModule),
    forwardRef(() => SecurityModule),
  ],
  controllers: [UserController],
  providers: [
    CreateTokenSendMailListener,
    CreateUserUseCase,
    SendMailJob,
    {
      provide: 'IUserRepository',
      useClass: UserPostgresRepository,
    },
  ],
  exports: [SendMailJob, 'IUserRepository'],
})
export class UserModule {}
