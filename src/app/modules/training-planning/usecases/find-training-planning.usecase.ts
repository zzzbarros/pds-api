import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FindTrainingPlanningRequestDto,
  FindTrainingPlanningResponseDto,
} from '../dtos';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingPlanningRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';
import { TrainingPlanningEntity } from '../entities';

@Injectable()
export class FindTrainingPlanningUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  async execute(
    input: FindTrainingPlanningRequestDto,
  ): Promise<FindTrainingPlanningResponseDto> {
    const { athleteUuid, startDate, endDate } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const [
      trainingPlanning,
      previousWeekTrainingPlanning,
      nextWeekTrainingPlanning,
    ] = await Promise.all([
      this.trainingPlanningRepository.find({
        startDate,
        endDate,
        athleteId: athlete.getId(),
      }),
      this.trainingPlanningRepository.find({
        startDate: this.getPreviousWeekDate(new Date(startDate)),
        endDate: this.getPreviousWeekDate(new Date(endDate)),
        athleteId: athlete.getId(),
      }),
      this.trainingPlanningRepository.find({
        startDate: this.getNextWeekDate(new Date(startDate)),
        endDate: this.getNextWeekDate(new Date(endDate)),
        athleteId: athlete.getId(),
      }),
    ]);

    return {
      trainingPlanning: trainingPlanning.map((planning) => ({
        id: planning.getUuid(),
        date: planning.getDate(),
        duration: planning.getDuration(),
        pse: planning.getPSE(),
        trainingType: {
          id: planning.getTrainingType().getUuid(),
          name: planning.getTrainingType().getName(),
        },
        description: planning.getDescription(),
        load: planning.getLoad(),
      })),
      charge: {
        week: this.getWeekCharge(trainingPlanning),
        previousWeek: this.getWeekCharge(previousWeekTrainingPlanning),
        nextWeek: this.getWeekCharge(nextWeekTrainingPlanning),
      },
      trainingTotals: {
        week: trainingPlanning.length,
        previousWeek: previousWeekTrainingPlanning.length,
        nextWeek: nextWeekTrainingPlanning.length,
      },
    };
  }

  private getWeekCharge(trainings: TrainingPlanningEntity[]): number {
    return trainings.reduce((acc, training) => {
      const charge = training.getDuration() * training.getPSE();
      return (acc += charge);
    }, 0);
  }

  private getPreviousWeekDate(date: Date): Date {
    const previousWeekDate = new Date(date);
    previousWeekDate.setDate(date.getDate() - 7);
    return previousWeekDate;
  }

  private getNextWeekDate(date: Date): Date {
    const nextWeekDate = new Date(date);
    nextWeekDate.setDate(date.getDate() + 7);
    return nextWeekDate;
  }
}
