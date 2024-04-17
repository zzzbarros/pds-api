import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../dtos';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GenerateAccessTokenUseCase implements IBaseUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  public async execute(payload: JwtPayloadDto): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRATION'),
    });
  }
}
