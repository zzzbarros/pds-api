import { GetWellBeingMonitoringRequestDto } from '../dtos';
import { WellBeingMonitoryEntity } from '../entities';

export interface IWellBeingRepository {
  capture(entity: WellBeingMonitoryEntity): Promise<void>;
  getWeekMonitoring(
    query: GetWellBeingMonitoringRequestDto,
  ): Promise<WellBeingMonitoryEntity[]>;
}
