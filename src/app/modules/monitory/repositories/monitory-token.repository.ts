import { TokenEntity } from '../../auth';

export interface IMonitoryTokenRepository {
  save(token: TokenEntity): Promise<TokenEntity>;
  saveBatch(token: TokenEntity[]): Promise<void>;
  update(token: TokenEntity): Promise<void>;
  findByToken(token: string): Promise<TokenEntity | null>;
  invalidateTokensByUserIds(ids: number[]): Promise<void>;
}
