import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from '../../auth';
import {
  CreateTrainingTypeUseCase,
  FindTrainingTypeUseCase,
  GetAllTrainingTypesUseCase,
  ListTrainingTypeUseCase,
  UpdateTrainingTypeStatusUseCase,
  UpdateTrainingTypeUseCase,
} from '../usecases';
import { CreateTrainingTypeDto, UpdateTrainingTypeDto } from '../dtos';
import { PaginateRequestDto, Roles, UserRoleEnum } from 'src/app/shared';

@Controller('training-types')
export class TrainingTypeController {
  constructor(
    private readonly updateTrainingType: UpdateTrainingTypeUseCase,
    private readonly updateTrainingTypeStatus: UpdateTrainingTypeStatusUseCase,
    private readonly findTrainingType: FindTrainingTypeUseCase,
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

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async find(@Param('uuid') uuid: string) {
    return await this.findTrainingType.execute(uuid);
  }

  @Patch(':uuid/update-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async updateStatus(@Param('uuid') uuid: string) {
    await this.updateTrainingTypeStatus.execute(uuid);
    return { message: 'Status do tipo de treino atualizado sucesso!' };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async update(
    @Param('uuid') uuid: string,
    @Body() body: UpdateTrainingTypeDto,
  ) {
    await this.updateTrainingType.execute({ uuid, ...body });
    return { message: 'Tipo de treino atualizado sucesso!' };
  }
}
