import { Injectable } from '@nestjs/common';
import {
  WellBeingMonitoryEntity,
  IWellBeingRepository,
  GetWellBeingMonitoringRequestDto,
} from 'src/app/modules/monitory';
import { PrismaPGService } from '../prisma-pg.service';

@Injectable()
export class WellBeingPostgresRepository implements IWellBeingRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async capture(entity: WellBeingMonitoryEntity): Promise<void> {
    await this.prismaService.wellBeingMonitoring.create({
      data: {
        date: entity.getDate(),
        athleteId: entity.getAthleteId(),
        sleep: entity.getSleep(),
        stress: entity.getStress(),
        disposition: entity.getDisposition(),
        musclePain: entity.getMusclePain(),
        humor: entity.getHumor(),
      },
    });
  }

  async getWeekMonitoring(
    query: GetWellBeingMonitoringRequestDto,
  ): Promise<WellBeingMonitoryEntity[]> {
    const { athleteUuid, startDate, endDate } = query;
    const wellBeingCaptures =
      await this.prismaService.wellBeingMonitoring.findMany({
        where: {
          athlete: {
            uuid: athleteUuid,
          },
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    return wellBeingCaptures.map(
      (wellBeing) => new WellBeingMonitoryEntity(wellBeing),
    );
  }
}
