import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreatePasswordDto, LoginRequestDto, LoginResponseDto } from '../dtos';
import {
  GenerateRefreshTokenUseCase,
  GenerateAccessTokenUseCase,
  LoginUseCase,
  CreatePasswordUseCase,
} from '../usecases';
import { IBaseResponse } from 'src/app/shared';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createPasswordUseCase: CreatePasswordUseCase,
    private readonly generateRefreshToken: GenerateRefreshTokenUseCase,
    private readonly generateAccessToken: GenerateAccessTokenUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.loginUseCase.execute(body);

    const [token, refreshToken] = await Promise.all([
      this.generateAccessToken.execute({
        type: user.getRole(),
        userId: user.getId(),
      }),
      this.generateRefreshToken.execute(user.getId()),
    ]);

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

  @Post('create-password')
  @HttpCode(HttpStatus.OK)
  async createPassword(
    @Body() body: CreatePasswordDto,
  ): Promise<IBaseResponse> {
    await this.createPasswordUseCase.execute(body);
    return {
      title: 'Senha cadastrada com sucesso!',
      message: 'Acesse a plataforma...',
    };
  }
}
