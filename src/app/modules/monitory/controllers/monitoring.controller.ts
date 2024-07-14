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
  CaptureAthleteWellBeingDto,
  GetWellBeingMonitoringRequestDto,
  WeekMonitoringRequestDto,
} from '../dtos';
import {
  GetWeekMonitoringUseCase,
  MonotonyMonitoringUseCase,
  CaptureAthleteWellBeingUseCase,
  GetWellBeingMonitoringUseCase,
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly GetWeekMonitoringUseCase: GetWeekMonitoringUseCase,
    private readonly monotonyMonitoringUseCase: MonotonyMonitoringUseCase,
    private readonly captureAthleteWellBeingUseCase: CaptureAthleteWellBeingUseCase,
    private readonly getWellBeingMonitoringUseCase: GetWellBeingMonitoringUseCase,
  ) {}

  @Get('week')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async week(@Query() query: WeekMonitoringRequestDto) {
    return await this.GetWeekMonitoringUseCase.execute(query);
  }

  @Get('monotony')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.COACH)
  async monotony(@Query() query: WeekMonitoringRequestDto) {
    return await this.monotonyMonitoringUseCase.execute(query);
  }

  @Post('well-being')
  @HttpCode(HttpStatus.CREATED)
  async captureAthleteWellBeing(@Body() body: CaptureAthleteWellBeingDto) {
    return await this.captureAthleteWellBeingUseCase.execute(body);
  }

  @Get('well-being')
  @HttpCode(HttpStatus.OK)
  async getWellBeingMonitory(@Query() query: GetWellBeingMonitoringRequestDto) {
    return await this.getWellBeingMonitoringUseCase.execute(query);
  }
}
