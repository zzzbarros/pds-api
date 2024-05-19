import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './usecases';
import { SendMailJob } from './jobs';
import { UserController } from './controllers';
import { QueueModule } from '../queues/queue.module';
import { MailModule } from '../mail/mail.module';
import { SecurityModule } from 'src/infra/security/security.module';
import { UserPostgresRepository } from 'src/infra/databases/orms/prisma/postgres';

@Module({
  imports: [QueueModule, SecurityModule, MailModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    SendMailJob,
    {
      provide: 'IUserRepository',
      useClass: UserPostgresRepository,
    },
  ],
  exports: [SendMailJob],
})
export class UserModule {}
