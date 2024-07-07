import { Injectable } from '@nestjs/common';
import {
  CaptureWellBeing,
  IWellBeingRepository,
} from 'src/app/modules/monitory';
import { PrismaPGService } from '../prisma-pg.service';

@Injectable()
export class WellBeingPostgresRepository implements IWellBeingRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async capture(entity: CaptureWellBeing): Promise<void> {
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
}
