import { TokenType } from 'src/app/shared';
import { TokenEntity } from '../entities';

export class AuthTransformer {
  static toTokenEntity(userId: string, type: TokenType): TokenEntity {
    const newToken = new TokenEntity();
    newToken.setUserId(userId);
    newToken.setType(type);
    newToken.setExpiresIn();
    newToken.setToken();
    newToken.setIsValid();

    return newToken;
  }
}
