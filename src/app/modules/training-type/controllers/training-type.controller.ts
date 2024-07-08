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
import { UserEntity } from '../../user';
import {
  CreateTrainingTypeUseCase,
  FindTrainingTypeUseCase,
  GetAllTrainingTypesUseCase,
  ListTrainingTypeUseCase,
  UpdateTrainingTypeStatusUseCase,
  UpdateTrainingTypeUseCase,
} from '../usecases';
import { CreateTrainingTypeDto, UpdateTrainingTypeDto } from '../dtos';
import {
  GetUserAuth,
  PaginateRequestDto,
  Roles,
  UserRoleEnum,
} from 'src/app/shared';

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
  async create(
    @Body() body: Omit<CreateTrainingTypeDto, 'coachId'>,
    @GetUserAuth() user: UserEntity,
  ) {
    await this.createTrainingType.execute({
      ...body,
      coachId: user.getCoachId(),
    });
    return { message: 'Tipo de Treino criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async list(
    @Query() query: PaginateRequestDto,
    @GetUserAuth() user: UserEntity,
  ) {
    return await this.listTrainingType.execute({
      ...query,
      coachId: user.getCoachId(),
    });
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async getAll(@GetUserAuth() user: UserEntity) {
    return await this.getAllTrainingTypes.execute(user.getId());
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
    return { message: 'Status do tipo de treino atualizado com sucesso!' };
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
    return { message: 'Tipo de treino atualizado com sucesso!' };
  }
}
