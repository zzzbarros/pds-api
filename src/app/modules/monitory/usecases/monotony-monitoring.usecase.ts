import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MonotonyMonitoringRequestDto,
  MonotonyMonitoringResponseDto,
} from '../dtos';
import {
  TrainingPlanningEntity,
  type ITrainingPlanningRepository,
} from '../../training-planning';
import {
  getDate28DaysEarlier,
  getLastFourWeeks,
  getWeekNumberFromDate,
  type IBaseUseCase,
} from 'src/app/shared';
import type { IAthleteRepository } from '../../athlete';
import type { IMonitoryRepository } from '../repositories';

@Injectable()
export class MonotonyMonitoringUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IMonitoryRepository')
    private readonly monitoryRepository: IMonitoryRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  public async execute(
    input: MonotonyMonitoringRequestDto,
  ): Promise<MonotonyMonitoringResponseDto> {
    const { athleteUuid, startDate: startStr, endDate: endStr } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete) {
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });
    }

    const athleteId = athlete.getId();
    const startDate = new Date(startStr);
    const weekDate = getWeekNumberFromDate(startDate);
    const previousWeekDates = getLastFourWeeks(weekDate);
    const weeks = [...previousWeekDates, weekDate];

    const [weeksMonitory, plannedTrainings] = await Promise.all([
      this.monitoryRepository.findWeeks(athleteId, weeks),
      this.trainingPlanningRepository.find({
        athleteId,
        startDate: getDate28DaysEarlier(startDate),
        endDate: endStr,
      }),
    ]);

    const plannedLoads = this.calculatePlannedLoadsPerWeek(
      plannedTrainings,
      weeks,
    );

    return weeksMonitory.reduce(
      (data, week) => {
        const weekStart = week.getStartDate().toLocaleDateString();
        const weekEnd = week.getEndDate().toLocaleDateString();

        data.week.push(`${weekStart} - ${weekEnd}`);
        data.strain.push(week.getStrain());
        data.monotony.push(week.getMonotony());
        data.acuteChronicLoadRatio.push(week.getChronicAcute());
        data.load.performed.push(week.getWeekLoad());
        data.load.planned.push(plannedLoads[week.getWeek()]);

        return data;
      },
      {
        week: [],
        strain: [],
        monotony: [],
        acuteChronicLoadRatio: [],
        load: {
          performed: [],
          planned: [],
        },
      },
    );
  }

  private calculatePlannedLoadsPerWeek(
    plannedTrainings: TrainingPlanningEntity[],
    weeks: string[],
  ): Record<number, number> {
    const plannedLoadPerWeek: Record<number, number> = {};

    plannedTrainings.forEach((training) => {
      const trainingWeek = getWeekNumberFromDate(training.getDate());
      if (weeks.includes(trainingWeek)) {
        if (!plannedLoadPerWeek[trainingWeek]) {
          plannedLoadPerWeek[trainingWeek] = 0;
        }
        plannedLoadPerWeek[trainingWeek] += training.getLoad();
      }
    });

    return plannedLoadPerWeek;
  }
}
