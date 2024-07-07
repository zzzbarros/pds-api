import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { TokenTypeEnum } from 'src/app/shared';
import { TokenEntity } from 'src/app/modules/auth';
import type { IMonitoryTokenRepository } from 'src/app/modules/monitory';

@Injectable()
export class MonitoryTokenPostgresRepository
  implements IMonitoryTokenRepository
{
  private tokenType = TokenTypeEnum.MONITORY;

  constructor(private readonly prismaService: PrismaPGService) {}

  async findByToken(recoveryToken: string): Promise<TokenEntity> {
    const token = await this.prismaService.token.findFirst({
      where: { token: recoveryToken, type: this.tokenType },
    });
    if (!token) return null;
    return new TokenEntity({ ...token, type: token.type as TokenTypeEnum });
  }

  async save(data: TokenEntity): Promise<TokenEntity> {
    const token = await this.prismaService.token.create({
      data: {
        token: data.getToken(),
        type: data.getType(),
        userId: data.getUserId(),
        expiresIn: data.getExpiresIn(),
      },
    });
    return new TokenEntity({
      ...token,
      type: token.type as TokenTypeEnum.MONITORY,
    });
  }

  async saveBatch(tokens: TokenEntity[]): Promise<void> {
    await this.prismaService.token.createMany({
      data: tokens.map((data) => ({
        token: data.getToken(),
        type: data.getType(),
        userId: data.getUserId(),
        expiresIn: data.getExpiresIn(),
      })),
    });
  }

  async update(token: TokenEntity): Promise<void> {
    await this.prismaService.token.update({
      where: { id: token.getId() },
      data: {
        isValid: token.getIsValid(),
      },
    });
  }

  async invalidateTokensByUserIds(ids: number[]): Promise<void> {
    await this.prismaService.token.updateMany({
      where: {
        userId: { in: ids },
        type: this.tokenType,
      },
      data: {
        isValid: false,
      },
    });
  }
}
