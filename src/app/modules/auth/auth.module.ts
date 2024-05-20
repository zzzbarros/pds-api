import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import {
  CreatePasswordUseCase,
  GenerateAccessTokenUseCase,
  GenerateRefreshTokenUseCase,
  LoginUseCase,
} from './usecases';
import { AuthController } from './controllers';
import { SecurityModule } from 'src/infra/security/security.module';
import {
  RecoveryTokenPostgresRepository,
  RefreshTokenPostgresRepository,
} from 'src/infra/databases/orms/prisma/postgres';

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => SecurityModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    CreatePasswordUseCase,
    GenerateAccessTokenUseCase,
    GenerateRefreshTokenUseCase,
    JwtStrategy,
    LoginUseCase,
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenPostgresRepository,
    },
    {
      provide: 'IRecoveryTokenRepository',
      useClass: RecoveryTokenPostgresRepository,
    },
  ],
  exports: ['IRecoveryTokenRepository'],
})
export class AuthModule {}
