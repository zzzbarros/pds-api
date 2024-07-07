import { CaptureWellBeing } from '../entities';

export interface IWellBeingRepository {
  capture(entity: CaptureWellBeing): Promise<void>;
}
