import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from '../../auth';
import { WeekMonitoringRequestDto } from '../dtos';
import { WeekMonitoringUseCase, MonotonyMonitoringUseCase } from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly weekMonitoringUseCase: WeekMonitoringUseCase,
    private readonly monotonyMonitoringUseCase: MonotonyMonitoringUseCase,
  ) {}

  @Get('week')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async week(@Query() query: WeekMonitoringRequestDto) {
    return await this.weekMonitoringUseCase.execute(query);
  }

  @Get('monotony')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async monotony(@Query() query: WeekMonitoringRequestDto) {
    return await this.monotonyMonitoringUseCase.execute(query);
  }
}
