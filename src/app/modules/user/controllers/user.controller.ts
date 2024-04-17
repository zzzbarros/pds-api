import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../usecases';
import { CreateUserDto } from '../dtos';
import type { IBaseResponse } from 'src/app/shared';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CreateUserDto): Promise<IBaseResponse> {
    await this.createUserUseCase.execute(body);

    return { message: 'Cadastro efetuado com sucesso' };
  }
}
