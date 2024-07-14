import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import {
  TrainingPlanningEntity,
  type ITrainingPlanningRepository,
} from 'src/app/modules/training-planning';
import { TrainingTypeEntity } from 'src/app/modules/training-type';

@Injectable()
export class TrainingPlanningRepository implements ITrainingPlanningRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async create(trainingPlanning: TrainingPlanningEntity): Promise<void> {
    await this.prismaService.trainingPlanning.create({
      data: {
        athleteId: trainingPlanning.getAthleteId(),
        trainingTypeId: trainingPlanning.getTrainingTypeId(),
        date: trainingPlanning.getDate(),
        duration: trainingPlanning.getDuration(),
        pse: trainingPlanning.getPSE(),
        description: trainingPlanning.getDescription(),
        finished: trainingPlanning.getFinished()
      },
    });
  }

  async find(options: {
    startDate: Date;
    endDate: Date;
    athleteId: number;
  }): Promise<TrainingPlanningEntity[]> {
    const { startDate, endDate, athleteId } = options;
    const trainingPlannings =
      await this.prismaService.trainingPlanning.findMany({
        where: {
          athleteId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: { trainingType: true },
      });

    return trainingPlannings.map(({ trainingType, ...trainingPlanning }) => {
      return new TrainingPlanningEntity({
        ...trainingPlanning,
        trainingType: new TrainingTypeEntity(trainingType),
      });
    });
  }

  async findByUuid(uuid: string): Promise<TrainingPlanningEntity | null> {
    const training = await this.prismaService.trainingPlanning.findUnique({
      where: { uuid },
      include: { trainingType: true },
    });
    if (!training) return null;
    return new TrainingPlanningEntity({
      ...training,
      trainingType: new TrainingTypeEntity(training.trainingType),
    });
  }

  async update(trainingPlanning: TrainingPlanningEntity): Promise<void> {
    await this.prismaService.trainingPlanning.update({
      where: {
        uuid: trainingPlanning.getUuid(),
      },
      data: {
        athleteId: trainingPlanning.getAthleteId(),
        trainingTypeId: trainingPlanning.getTrainingTypeId(),
        date: trainingPlanning.getDate(),
        duration: trainingPlanning.getDuration(),
        pse: trainingPlanning.getPSE(),
        description: trainingPlanning.getDescription(),
        finished: trainingPlanning.getFinished(),
      },
    });
  }

  async delete(uuid: string): Promise<void> {
    await this.prismaService.trainingPlanning.delete({ where: { uuid } });
  }
}
