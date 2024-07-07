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
import {
  GetUserAuth,
  PaginateRequestDto,
  Roles,
  UserRoleEnum,
} from 'src/app/shared';
import {
  CreateAthleteUseCase,
  FindAthleteUseCase,
  ListAthletesUseCase,
  UpdateAthleteStatusUseCase,
  UpdateAthleteUseCase,
} from '../usecases';
import { CreateAthleteDto, UpdateAthleteDto } from '../dtos';
import { Guards } from '../../auth/guards';
import { UserEntity } from '../../user';

@Controller('athletes')
export class AthleteController {
  constructor(
    private readonly createAthleteUseCase: CreateAthleteUseCase,
    private readonly listAthletesUseCase: ListAthletesUseCase,
    private readonly findAthleteUseCase: FindAthleteUseCase,
    private readonly updateAthleteStatusUseCase: UpdateAthleteStatusUseCase,
    private readonly updateAthleteUseCase: UpdateAthleteUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async create(
    @Body() body: Omit<CreateAthleteDto, 'coachId'>,
    @GetUserAuth() user: UserEntity,
  ) {
    await this.createAthleteUseCase.execute({
      ...body,
      coachId: user.getCoachId(),
    });
    return { message: 'Usuário criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async list(
    @Query() query: PaginateRequestDto,
    @GetUserAuth() user: UserEntity,
  ) {
    return await this.listAthletesUseCase.execute({
      ...query,
      coachId: user.getCoachId(),
    });
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async find(@Param('uuid') uuid: string) {
    return await this.findAthleteUseCase.execute(uuid);
  }

  @Patch(':uuid/update-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async updateStatus(@Param('uuid') uuid: string) {
    return await this.updateAthleteStatusUseCase.execute(uuid);
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async update(@Param('uuid') uuid: string, @Body() body: UpdateAthleteDto) {
    return await this.updateAthleteUseCase.execute({ uuid, ...body });
  }
}
