import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import {
  TrainingTypeEntity,
  ListTrainingTypeRequestDto,
  type ITrainingTypeRepository,
} from 'src/app/modules/training-type';

@Injectable()
export class TrainingTypePostgresRepository implements ITrainingTypeRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async create(trainingType: TrainingTypeEntity): Promise<void> {
    await this.prismaService.trainingType.create({
      data: {
        name: trainingType.getName(),
        coachId: trainingType.getCoachId(),
        isEnabled: trainingType.getIsEnabled(),
      },
    });
  }

  async list({
    page = 1,
    size = 10,
    search,
    coachId,
  }: ListTrainingTypeRequestDto): Promise<TrainingTypeEntity[]> {
    const trainingTypes = await this.prismaService.trainingType.findMany({
      take: size,
      skip: (page - 1) * size,
      where: {
        coachId,
      ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
      },
    });
    return trainingTypes.map(
      (trainingType) => new TrainingTypeEntity(trainingType),
    );
  }

  async count({
    search,
    coachId,
  }: Pick<ListTrainingTypeRequestDto, 'search' | 'coachId'>): Promise<number> {
    return await this.prismaService.trainingType.count({
      where: {
      coachId,
      ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
      },
    });
  }

  async findByUuid(uuid: string): Promise<TrainingTypeEntity | null> {
    const trainingType = await this.prismaService.trainingType.findUnique({
      where: { uuid },
    });
    if (!trainingType) return null;
    return new TrainingTypeEntity(trainingType);
  }

  async findAll(where: {
    coachId: number;
    isEnabled: boolean;
  }): Promise<TrainingTypeEntity[]> {
    const trainingTypes = await this.prismaService.trainingType.findMany({
      where,
    });
    if (!trainingTypes.length) return [];
    return trainingTypes.map(
      (trainingType) => new TrainingTypeEntity(trainingType),
    );
  }

  async update(trainingType: TrainingTypeEntity): Promise<void> {
    await this.prismaService.trainingType.update({
      where: { id: trainingType.getId() },
      data: {
        name: trainingType.getName(),
        isEnabled: trainingType.getIsEnabled(),
      },
    });
  }
}
