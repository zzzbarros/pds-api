import { TokenEntity } from '../entities';

export interface IRefreshTokenRepository {
  findByToken(refreshToken: string): Promise<TokenEntity | null>;
  invalidateTokensByUserId(userId: string): Promise<void>;
  save(token: TokenEntity): Promise<TokenEntity>;
}
