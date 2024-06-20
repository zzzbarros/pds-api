import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginateRequestDto, Roles, UserRoleEnum } from 'src/app/shared';
import {
  CreateAthleteUseCase,
  FindAthleteUseCase,
  ListAthletesUseCase,
} from '../usecases';
import { CreateAthleteDto } from '../dtos';
import { Guards } from '../../auth/guards';

@Controller('athletes')
export class AthleteController {
  constructor(
    private readonly createAthleteUseCase: CreateAthleteUseCase,
    private readonly listAthletesUseCase: ListAthletesUseCase,
    private readonly findAthleteUseCase: FindAthleteUseCase,
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async find(@Param('id') id: string) {
    return await this.findAthleteUseCase.execute(id);
  }
}
