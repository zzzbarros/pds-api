import { TrainingPlanningEntity } from '../entities';

export interface ITrainingPlanningRepository {
  create(entity: TrainingPlanningEntity): Promise<void>;
  find(options: {
    athleteId: number;
    startDate: Date;
    endDate: Date;
  }): Promise<TrainingPlanningEntity[]>;
}
