import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { AthleteEntity, IAthleteRepository } from 'src/app/modules/athlete';

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
}
