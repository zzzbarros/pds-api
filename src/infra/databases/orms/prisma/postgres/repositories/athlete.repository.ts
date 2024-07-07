import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import {
  AthleteEntity,
  IAthleteRepository,
  ListAthletesRequestDto,
} from 'src/app/modules/athlete';

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
        coachId: athlete.getCoachId(),
      },
    });
  }

  async findByEmail(
    email: string,
    coachId: number,
  ): Promise<AthleteEntity | null> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: {
        email_coachId: {
          email,
          coachId,
        },
      },
    });
    if (!athlete) return null;
    return new AthleteEntity(athlete);
  }

  async findAll(query: { isEnabled: boolean }): Promise<AthleteEntity[]> {
    const athletes = await this.prismaService.athlete.findMany({
      where: {
        isEnabled: query.isEnabled,
      },
    });
    return athletes.map((athlete) => new AthleteEntity(athlete));
  }

  async listAll({
    page = 1,
    size = 10,
    search,
    coachId,
  }: ListAthletesRequestDto): Promise<AthleteEntity[]> {
    const athletes = await this.prismaService.athlete.findMany({
      take: size,
      skip: (page - 1) * size,
      where: {
        coachId,
        ...(search && {
          OR: [
            { coachId, name: { contains: search, mode: 'insensitive' } },
            { coachId, email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });
    return athletes.map((athlete) => new AthleteEntity(athlete));
  }

  async count({
    search,
    coachId,
  }: Pick<ListAthletesRequestDto, 'search' | 'coachId'>): Promise<number> {
    return await this.prismaService.athlete.count({
      where: {
        coachId,
        ...(search && {
          OR: [
            { coachId, name: { contains: search, mode: 'insensitive' } },
            { coachId, email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });
  }

  async findByUuid(uuid: string): Promise<AthleteEntity | null> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: { uuid },
    });
    if (!athlete) return null;
    return new AthleteEntity(athlete);
  }

  async update(athlete: AthleteEntity): Promise<void> {
    await this.prismaService.athlete.update({
      where: { uuid: athlete.getUuid() },
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
}
