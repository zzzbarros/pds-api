import { Module, forwardRef } from '@nestjs/common';
import { CreateUserUseCase } from './usecases';
import { UserController } from './controllers';
import { SecurityModule, UserInMemoryRepository } from 'src/infra';

@Module({
  imports: [SecurityModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserInMemoryRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
