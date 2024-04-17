import { Inject, Injectable } from '@nestjs/common';
import { AuthTransformer } from '../transformers/auth.transformer';
import { TokenType, type IBaseUseCase } from 'src/app/shared';
import type { IRefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class GenerateRefreshTokenUseCase implements IBaseUseCase {
  constructor(
    @Inject('IRefreshTokenRepository')
    private readonly tokenRepository: IRefreshTokenRepository,
  ) {}

  public async execute(userId: string): Promise<string> {
    await this.tokenRepository.invalidateTokensByUserId(userId);

    const tokenEntity = AuthTransformer.toTokenEntity(
      userId,
      TokenType.refresh,
    );

    const token = await this.tokenRepository.save(tokenEntity);

    return token.getToken();
  }
}
