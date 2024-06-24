import { TrainingPlanningEntity } from '../entities';

export interface ITrainingPlanningRepository {
  create(entity: TrainingPlanningEntity): Promise<void>;
  update(entity: TrainingPlanningEntity): Promise<void>;
  find(options: {
    athleteId: number;
    startDate: Date;
    endDate: Date;
  }): Promise<TrainingPlanningEntity[]>;
  findByUuid(uuid: string): Promise<TrainingPlanningEntity | null>;
  delete(uuid: string): Promise<void>;
}
