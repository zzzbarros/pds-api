import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import {
  TrainingTypeEntity,
  type ITrainingTypeRepository,
} from 'src/app/modules/training-type';
import { PaginateRequestDto } from 'src/app/shared';

@Injectable()
export class TrainingTypePostgresRepository implements ITrainingTypeRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async create(trainingType: TrainingTypeEntity): Promise<void> {
    await this.prismaService.trainingType.create({
      data: {
        name: trainingType.getName(),
        isEnabled: trainingType.getIsEnabled(),
      },
    });
  }

  async findAll({
    page = 1,
    size = 10,
    search,
  }: PaginateRequestDto): Promise<TrainingTypeEntity[]> {
    const trainingTypes = await this.prismaService.trainingType.findMany({
      take: size,
      skip: (page - 1) * size,
      ...(search && {
        where: {
          name: { contains: search },
        },
      }),
    });
    return trainingTypes.map(
      (trainingType) => new TrainingTypeEntity(trainingType),
    );
  }

  async count({ search }: Pick<PaginateRequestDto, 'search'>): Promise<number> {
    return await this.prismaService.trainingType.count({
      ...(search && {
        where: {
          name: { contains: search },
        },
      }),
    });
  }
}
