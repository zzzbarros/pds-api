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
import { AuthGuard } from '@nestjs/passport';
import { Guards } from '../../auth';
import {
  CreateTrainingTypeUseCase,
  GetAllTrainingTypesUseCase,
  ListTrainingTypeUseCase,
} from '../usecases';
import { CreateTrainingTypeDto } from '../dtos';
import { PaginateRequestDto, Roles, UserRoleEnum } from 'src/app/shared';

@Controller('training-types')
export class TrainingTypeController {
  constructor(
    private readonly createTrainingType: CreateTrainingTypeUseCase,
    private readonly listTrainingType: ListTrainingTypeUseCase,
    private readonly getAllTrainingTypes: GetAllTrainingTypesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async create(@Body() body: CreateTrainingTypeDto) {
    await this.createTrainingType.execute(body);
    return { message: 'Tipo de Treino criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async list(@Query() query: PaginateRequestDto) {
    return await this.listTrainingType.execute(query);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async getAll() {
    return await this.getAllTrainingTypes.execute();
  }
}
