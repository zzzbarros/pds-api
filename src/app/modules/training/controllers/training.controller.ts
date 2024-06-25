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
  CreateTrainingDto,
  DeleteTrainingDto,
  FindTrainingRequestDto,
  UpdateTrainingDto,
} from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from 'src/app/modules/auth';
import {
  CreateTrainingUseCase,
  DeleteTrainingUseCase,
  FindTrainingUseCase,
  UpdateTrainingUseCase,
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('trainings')
export class TrainingController {
  constructor(
    private readonly createTrainingUseCase: CreateTrainingUseCase,
    private readonly findTrainingUseCase: FindTrainingUseCase,
    private readonly deleteTrainingUseCase: DeleteTrainingUseCase,
    private readonly updateTrainingUseCase: UpdateTrainingUseCase,
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

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async update(@Body() body: UpdateTrainingDto) {
    await this.updateTrainingUseCase.execute(body);
    return { message: 'Treino atualizado com sucesso!' };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async delete(@Param() { uuid }: DeleteTrainingDto) {
    await this.deleteTrainingUseCase.execute(uuid);
    return { message: 'Treino removido com sucesso!' };
  }
}
