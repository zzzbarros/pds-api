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
import {
  CreateTrainingPlanningDto,
  FindTrainingPlanningRequestDto,
} from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from 'src/app/modules/auth';
import {
  CreateTrainingPlanningUseCase,
  FindTrainingPlanningUseCase,
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('training-planning')
export class TrainingPlanningController {
  constructor(
    private readonly createTrainingPlanningUseCase: CreateTrainingPlanningUseCase,
    private readonly findTrainingPlanningUseCase: FindTrainingPlanningUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async create(@Body() body: CreateTrainingPlanningDto) {
    await this.createTrainingPlanningUseCase.execute(body);
    return { message: 'Planejamento do treino criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async list(@Query() query: FindTrainingPlanningRequestDto) {
    return await this.findTrainingPlanningUseCase.execute(query);
  }
}
