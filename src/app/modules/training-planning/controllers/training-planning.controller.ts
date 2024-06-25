import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTrainingPlanningDto,
  DeleteTrainingPlanningDto,
  FindTrainingPlanningRequestDto,
  UpdateTrainingPlanningDto,
} from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from 'src/app/modules/auth';
import {
  CreateTrainingPlanningUseCase,
  DeleteTrainingPlanningUseCase,
  FindTrainingPlanningUseCase,
  UpdateTrainingPlanningUseCase,
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('training-planning')
export class TrainingPlanningController {
  constructor(
    private readonly createTrainingPlanningUseCase: CreateTrainingPlanningUseCase,
    private readonly updateTrainingPlanningUseCase: UpdateTrainingPlanningUseCase,
    private readonly findTrainingPlanningUseCase: FindTrainingPlanningUseCase,
    private readonly deleteTrainingPlanningUseCase: DeleteTrainingPlanningUseCase,
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

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async update(@Body() body: UpdateTrainingPlanningDto) {
    await this.updateTrainingPlanningUseCase.execute(body);
    return { message: 'Planejamento do treino atualizado com sucesso!' };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async delete(@Param() { uuid }: DeleteTrainingPlanningDto) {
    await this.deleteTrainingPlanningUseCase.execute(uuid);
    return { message: 'Planejamento do treino removido com sucesso!' };
  }
}
