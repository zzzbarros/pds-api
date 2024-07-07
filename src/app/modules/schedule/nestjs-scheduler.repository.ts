import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IScheduleRepository } from './schedule.repository';
import { SendWellBeingToAthletesUseCase } from '../monitory/usecases';

@Injectable()
export class NestjsSchedulerRepository implements IScheduleRepository {
  constructor(
    private readonly sendWellBeingToAthletesUseCase: SendWellBeingToAthletesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  public async sendCreateUserEmail(): Promise<void> {
    try {
      await this.sendWellBeingToAthletesUseCase.execute();
      console.log(
        'Mensagens de monitoramento diário dos atletas publicadas na fila!',
      );
    } catch (error) {
      console.log(
        'Falha ao publicar monitoramento diário dos atletas na fila!',
        error,
      );
    }
  }
}
