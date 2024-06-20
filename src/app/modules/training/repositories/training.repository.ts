import { TrainingEntity } from '../entities';

export interface ITrainingRepository {
  create(entity: TrainingEntity): Promise<void>;
  find(search: {
    athleteId: number;
    startDate: Date;
    endDate: Date;
  }): Promise<TrainingEntity[]>;
}
