import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import {
  TrainingEntity,
  type ITrainingRepository,
} from 'src/app/modules/training';
import { TrainingTypeEntity } from 'src/app/modules/training-type';

@Injectable()
export class TrainingPostgresRepository implements ITrainingRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async create(training: TrainingEntity): Promise<void> {
    await this.prismaService.training.create({
      data: {
        athleteId: training.getAthleteId(),
        trainingTypeId: training.getTrainingTypeId(),
        date: training.getDate(),
        duration: training.getDuration(),
        pse: training.getPSE(),
        psr: training.getPSR(),
        description: training.getDescription(),
        load: training.getLoad(),
      },
    });
  }

  async find(query: {
    startDate: Date;
    endDate: Date;
    athleteId: number;
  }): Promise<TrainingEntity[]> {
    const { startDate, endDate, athleteId } = query;
    const trainings = await this.prismaService.training.findMany({
      where: {
        athleteId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { trainingType: true },
    });

    return trainings.map(({ trainingType, ...training }) => {
      return new TrainingEntity({
        ...training,
        trainingType: new TrainingTypeEntity(trainingType),
      });
    });
  }
}
