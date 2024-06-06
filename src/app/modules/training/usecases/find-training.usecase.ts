import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindTrainingRequestDto, FindTrainingResponseDto } from '../dtos';
import { TrainingEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';

@Injectable()
export class FindTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  async execute(
    input: FindTrainingRequestDto,
  ): Promise<FindTrainingResponseDto> {
    const { athleteUuid, startDate, endDate } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const [trainings, previousWeekTraining, nextWeekTraining] =
      await Promise.all([
        this.trainingRepository.find({
          startDate,
          endDate,
          athleteId: athlete.getId(),
        }),
        this.trainingRepository.find({
          startDate: this.getPreviousWeekDate(new Date(startDate)),
          endDate: this.getPreviousWeekDate(new Date(endDate)),
          athleteId: athlete.getId(),
        }),
        this.trainingRepository.find({
          startDate: this.getNextWeekDate(new Date(startDate)),
          endDate: this.getNextWeekDate(new Date(endDate)),
          athleteId: athlete.getId(),
        }),
      ]);

    return {
      trainings: trainings.map((training) => ({
        id: training.getUuid(),
        date: training.getDate(),
        duration: training.getDuration(),
        pse: training.getPSE(),
        psr: training.getPSR(),
        trainingType: training.getTrainingType().getName(),
        description: training.getDescription(),
      })),
      charge: {
        week: this.getWeekCharge(trainings),
        previousWeek: this.getWeekCharge(previousWeekTraining),
        nextWeek: this.getWeekCharge(nextWeekTraining),
      },
      trainingTotals: {
        week: trainings.length,
        previousWeek: previousWeekTraining.length,
        nextWeek: nextWeekTraining.length,
      },
    };
  }

  private getWeekCharge(trainings: TrainingEntity[]): number {
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
