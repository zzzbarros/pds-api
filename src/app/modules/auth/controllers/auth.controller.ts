import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from '../dtos';
import {
  GenerateRefreshTokenUseCase,
  GenerateAccessTokenUseCase,
  LoginUseCase,
} from '../usecases';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly generateRefreshToken: GenerateRefreshTokenUseCase,
    private readonly generateAccessToken: GenerateAccessTokenUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.loginUseCase.execute(body);

    const refreshToken = await this.generateRefreshToken.execute(
      user.getUuid(),
    );

    const token = await this.generateAccessToken.execute({
      type: user.getRole(),
      userId: user.getUuid(),
    });

    return {
      token,
      refreshToken,
      user: {
        name: user.getName(),
        uuid: user.getUuid(),
        type: user.getRole(),
      },
    };
  }
}
