import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user';
import {
  GenerateAccessTokenUseCase,
  GenerateRefreshTokenUseCase,
  LoginUseCase,
} from './usecases';
import { AuthController } from './controllers';
import {
  RefreshTokenInMemoryRepository,
  RecoveryTokenInMemoryRepository,
  SecurityModule,
} from 'src/infra';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    SecurityModule,
    UserModule,
  ],
  providers: [
    GenerateAccessTokenUseCase,
    GenerateRefreshTokenUseCase,
    JwtStrategy,
    LoginUseCase,
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenInMemoryRepository,
    },
    {
      provide: 'IRecoveryTokenRepository',
      useClass: RecoveryTokenInMemoryRepository,
    },
  ],
})
export class AuthModule {}
