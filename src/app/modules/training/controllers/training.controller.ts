import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTrainingDto, FindTrainingRequestDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from 'src/app/modules/auth';
import { CreateTrainingUseCase, FindTrainingUseCase } from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('trainings')
export class TrainingController {
  constructor(
    private readonly createTrainingUseCase: CreateTrainingUseCase,
    private readonly findTrainingUseCase: FindTrainingUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async create(@Body() body: CreateTrainingDto) {
    await this.createTrainingUseCase.execute(body);
    return { message: 'Treino criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async list(@Query() query: FindTrainingRequestDto) {
    return await this.findTrainingUseCase.execute(query);
  }
}
