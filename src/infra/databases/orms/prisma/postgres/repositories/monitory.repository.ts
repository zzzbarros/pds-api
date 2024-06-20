import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { MonitoryEntity } from 'src/app/modules/monitoring/entities';
import { SortDirectionEnum, getWeekDatesFromInput } from 'src/app/shared';
import type { IMonitoringRepository } from 'src/app/modules/monitoring/repositories';

@Injectable()
export class MonitoryPostgresRepository implements IMonitoringRepository {
  constructor(private readonly prismaService: PrismaPGService) {}
  async upsertWeekLoad(entity: MonitoryEntity): Promise<void> {
    const data = {
      chronic: entity.getChronic(),
      monotony: entity.getMonotony(),
      chronicAcute: entity.getChronicAcute(),
      weekLoad: entity.getWeekLoad(),
      acute: entity.getAcute(),
      strain: entity.getStrain(),
      averageWeekLoad: entity.getAverageWeekLoad(),
      deviation: entity.getDeviation(),
    };
    await this.prismaService.weeklyMonitoring.upsert({
      create: {
        ...data,
        week: entity.getWeek(),
        startDate: entity.getStartDate(),
        endDate: entity.getEndDate(),
        athlete: {
          connect: {
            id: entity.getAthleteId(),
          },
        },
      },
      update: data,
      where: {
        week: entity.getWeek(),
        athleteId: entity.getAthleteId(),
      },
    });
  }

  async findWeeks(
    athleteId: number,
    weeks: string[],
  ): Promise<MonitoryEntity[]> {
    const data = await this.prismaService.weeklyMonitoring.findMany({
      where: { athleteId, week: { in: weeks } },
      orderBy: {
        startDate: SortDirectionEnum.DESC,
      },
    });
    return weeks.map((week) => {
      const result = data.find((d) => d.week == week);
      if (result) return new MonitoryEntity(result);
      const dates = getWeekDatesFromInput(week);
      return new MonitoryEntity({
        athleteId,
        week,
        startDate: dates[0],
        endDate: dates[dates.length - 1],
      });
    });
  }
}
