import { Module, forwardRef } from '@nestjs/common';
import { CreateUserUseCase } from './usecases';
import { UserController } from './controllers';
import { QueueModule } from '../queues/queue.module';
import { SecurityModule } from 'src/infra/security/security.module';
import { UserPostgresRepository } from 'src/infra/databases/orms/prisma/postgres';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    QueueModule,
    forwardRef(() => AuthModule),
    forwardRef(() => SecurityModule),
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserPostgresRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
