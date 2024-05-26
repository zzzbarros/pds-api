import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, UserRoleEnum } from 'src/app/shared';
import { CreateAthleteUseCase } from '../usecases';
import { CreateAthleteDto } from '../dtos';
import { Guards } from '../../auth/guards';

@Controller('athletes')
export class AthleteController {
  constructor(private readonly createAthleteUseCase: CreateAthleteUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async create(@Body() body: CreateAthleteDto) {
    await this.createAthleteUseCase.execute(body);
    return { message: 'Usuário criado com sucesso!' };
  }
}
