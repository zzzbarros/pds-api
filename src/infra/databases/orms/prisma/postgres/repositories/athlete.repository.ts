import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { AthleteEntity, IAthleteRepository } from 'src/app/modules/athlete';
import { PaginateRequestDto } from 'src/app/shared';

@Injectable()
export class AthletePostgresRepository implements IAthleteRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async create(athlete: AthleteEntity): Promise<void> {
    await this.prismaService.athlete.create({
      data: {
        name: athlete.getName(),
        email: athlete.getEmail(),
        birthday: athlete.getBirthday(),
        height: athlete.getHeight(),
        weight: athlete.getWeight(),
        isEnabled: athlete.getIsEnabled(),
      },
    });
  }

  async findByEmail(email: string): Promise<AthleteEntity | null> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: { email },
    });
    if (!athlete) return null;
    return new AthleteEntity(athlete);
  }

  async findAll({
    page = 1,
    size = 10,
    search,
  }: PaginateRequestDto): Promise<AthleteEntity[]> {
    const athletes = await this.prismaService.athlete.findMany({
      take: size,
      skip: (page - 1) * size,
      ...(search && {
        where: {
          name: { contains: search },
          OR: [{ email: { contains: search } }],
        },
      }),
    });
    return athletes.map((athlete) => new AthleteEntity(athlete));
  }

  async count({ search }: Pick<PaginateRequestDto, 'search'>): Promise<number> {
    return await this.prismaService.athlete.count({
      ...(search && {
        where: {
          name: { contains: search },
          OR: [{ email: { contains: search } }],
        },
      }),
    });
  }

  async findByUuid(uuid: string): Promise<AthleteEntity | null> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: { uuid },
    });
    if (!athlete) return null;
    return new AthleteEntity(athlete);
  }
}
