import { BaseEntity, TokenType } from 'src/app/shared';

export class TokenEntity extends BaseEntity {
  private token: string;
  private type: TokenType;
  private userId: string;
  private expiresIn: Date;
  private isValid: boolean;

  getExpiresIn(): Date {
    return this.expiresIn;
  }

  getToken(): string {
    return this.token;
  }

  getUserId(): string {
    return this.userId;
  }

  getType(): TokenType {
    return this.type;
  }

  getIsValid(): boolean {
    return this.isValid;
  }

  setToken(token?: string): void {
    const newToken = this.generateRandomToken();
    this.token = token ?? newToken;
  }

  setType(type: TokenType): void {
    this.type = type;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setExpiresIn(expiresIn?: Date) {
    const dayInMilliseconds = 86400000;
    const weekInMilliseconds = dayInMilliseconds * 7;
    const today = new Date();
    const expiresInDate = new Date(today.getTime() + weekInMilliseconds);

    this.expiresIn = expiresIn ?? expiresInDate;
  }

  setIsValid(isValid = true) {
    this.isValid = isValid;
  }

  private generateRandomToken(): string {
    const length = 32;
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }
}
