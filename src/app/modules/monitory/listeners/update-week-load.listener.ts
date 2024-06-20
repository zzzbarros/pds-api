import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EventsEnum,
  getFirstAndLastDayOfWeek,
  getLastFourWeeksFromDate,
} from 'src/app/shared';
import { UpdateWeekLoadDto } from '../dtos';
import { MonitoryEntity } from '../entities';
import type { IMonitoryRepository } from '../repositories';
import type { ITrainingRepository } from '../../training';

@Injectable()
export class UpdateWeekLoadListener {
  constructor(
    @Inject('IMonitoryRepository')
    private readonly monitoryRepository: IMonitoryRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  @OnEvent(EventsEnum.UPDATE_WEEK_LOAD, { async: true })
  async updateWeekLoad({ athleteId, date }: UpdateWeekLoadDto) {
    try {
      const { firstDay, lastDay, week } = getFirstAndLastDayOfWeek(date);
      const previousWeekDates = getLastFourWeeksFromDate(date);

      const dates = { startDate: firstDay, endDate: lastDay };

      const weekMonitory = new MonitoryEntity({
        athleteId,
        week,
        ...dates,
      });

      const previousWeeksMonitory = await this.monitoryRepository.findWeeks(
        athleteId,
        previousWeekDates,
      );

      const weekTrainings = await this.trainingRepository.find({
        athleteId,
        ...dates,
      });

      console.log(previousWeeksMonitory);

      weekMonitory.calculate(weekTrainings, previousWeeksMonitory);

      await this.monitoryRepository.upsertWeekLoad(weekMonitory);
    } catch (error) {
      console.log('Erro ao atualizar monitoramento da semana.', error);
    }
  }
}
