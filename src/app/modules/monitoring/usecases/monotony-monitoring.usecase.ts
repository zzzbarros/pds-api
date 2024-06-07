import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MonotonyMonitoringRequestDto,
  MonotonyMonitoringResponseDto,
} from '../dtos';
import {
  TrainingPlanningEntity,
  type ITrainingPlanningRepository,
} from '../../training-planning';
import type { IBaseUseCase } from 'src/app/shared';
import type { IAthleteRepository } from '../../athlete';
import type { ITrainingRepository, TrainingEntity } from '../../training';

@Injectable()
export class MonotonyMonitoringUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  public async execute(
    input: MonotonyMonitoringRequestDto,
  ): Promise<MonotonyMonitoringResponseDto> {
    const { athleteUuid, startDate: startStr, endDate: endStr } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    const previousWeekStartDate = this.getPreviousWeekDate(startDate);
    const previousWeekEndDate = this.getPreviousWeekDate(endDate);

    const week = [
      `${previousWeekStartDate.toLocaleDateString()}-${previousWeekEndDate.toLocaleDateString()}`,
      `${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}`,
    ];

    const [
      currentTrainings,
      lastWeekTrainings,
      plannedTrainings,
      plannedLastWeekTrainings,
    ] = await Promise.all([
      this.trainingRepository.find({
        startDate,
        endDate,
        athleteId: athlete.getId(),
      }),
      this.trainingRepository.find({
        startDate: previousWeekStartDate,
        endDate: previousWeekEndDate,
        athleteId: athlete.getId(),
      }),
      this.trainingPlanningRepository.find({
        startDate,
        endDate,
        athleteId: athlete.getId(),
      }),
      this.trainingPlanningRepository.find({
        startDate: previousWeekStartDate,
        endDate: previousWeekEndDate,
        athleteId: athlete.getId(),
      }),
    ]);

    const currentMetrics = this.calculateMetrics(currentTrainings);
    const lastWeekMetrics = this.calculateMetrics(lastWeekTrainings);

    const currentLoad = this.calculateTotalLoad(currentTrainings);
    const lastWeekLoad = this.calculateTotalLoad(lastWeekTrainings);
    const plannedLoad = this.calculateTotalLoad(plannedTrainings);
    const plannedLastWeekLoad = this.calculateTotalLoad(
      plannedLastWeekTrainings,
    );

    const acuteChronicLoadRatio = currentLoad / lastWeekLoad ?? 0;
    const plannedAcuteChronicLoadRatio = plannedLoad / plannedLastWeekLoad ?? 0;

    const strain = currentLoad * currentMetrics.monotony ?? 0;
    const lastWeekStrain = lastWeekLoad * lastWeekMetrics.monotony ?? 0;

    const monotony = currentMetrics.monotony ?? 0;
    const lastWeekMonotony = lastWeekMetrics.monotony ?? 0;

    return {
      week,
      strain: [lastWeekStrain, strain],
      monotony: [lastWeekMonotony, monotony],
      load: {
        performed: [lastWeekLoad, currentLoad],
        planned: [plannedLastWeekLoad, plannedLoad],
      },
      acuteChronicLoadRatio: [
        plannedAcuteChronicLoadRatio,
        acuteChronicLoadRatio,
      ],
    };
  }

  private generateDays(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  private getPreviousWeekDate(date: Date): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - 7);
    return result;
  }

  private calculateMetrics(trainings: TrainingEntity[]) {
    const dailyLoads = trainings.reduce(
      (acc, training) => {
        const dateStr = training.getDate().toISOString().split('T')[0];
        if (!acc[dateStr]) acc[dateStr] = 0;
        acc[dateStr] += training.getLoad();
        return acc;
      },
      {} as { [key: string]: number },
    );

    const loadData = Object.values(dailyLoads);
    const totalLoad = loadData.reduce((acc, load) => acc + load, 0);
    const meanLoad = totalLoad / loadData.length;
    const loadVariance = loadData.reduce(
      (acc, load) => acc + Math.pow(load - meanLoad, 2),
      0,
    );
    const loadStdDev = Math.sqrt(loadVariance / loadData.length);
    const monotony = meanLoad / (loadStdDev || 1);

    const strainArray = loadData.map((load) => load * monotony);

    return {
      totalLoad,
      meanLoad,
      monotony,
      dailyLoads: loadData,
      monotonyArray: new Array(loadData.length).fill(monotony),
      strainArray,
    };
  }

  private calculateTotalLoad(
    trainings: TrainingEntity[] | TrainingPlanningEntity[],
  ): number {
    return trainings.reduce((acc, training) => acc + training.getLoad(), 0);
  }
}
