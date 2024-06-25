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
import { PaginateRequestDto, Roles, UserRoleEnum } from 'src/app/shared';
import {
  CreateAthleteUseCase,
  FindAthleteUseCase,
  ListAthletesUseCase,
  UpdateAthleteStatusUseCase,
  UpdateAthleteUseCase,
} from '../usecases';
import { CreateAthleteDto, UpdateAthleteDto } from '../dtos';
import { Guards } from '../../auth/guards';

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
  async create(@Body() body: CreateAthleteDto) {
    await this.createAthleteUseCase.execute(body);
    return { message: 'Usuário criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async list(@Query() query: PaginateRequestDto) {
    return await this.listAthletesUseCase.execute(query);
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
    await this.updateAthleteStatusUseCase.execute(uuid);
    return { message: 'Status do atleta atualizado sucesso!' };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async update(@Param('uuid') uuid: string, @Body() body: UpdateAthleteDto) {
    await this.updateAthleteUseCase.execute({ uuid, ...body });
    return { message: 'Atleta atualizado sucesso!' };
  }
}
