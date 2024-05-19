import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../usecases';
import { CreateUserDto } from '../dtos';
import { IBaseResponse } from 'src/app/shared';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('coach')
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CreateUserDto): Promise<IBaseResponse> {
    await this.createUserUseCase.execute(body);
    return {
      title: 'Cadastro enviado com sucesso!',
      message: 'Verifique seu email.',
    };
  }
}
