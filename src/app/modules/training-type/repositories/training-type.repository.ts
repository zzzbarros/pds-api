import { TrainingTypeEntity } from '../entities';
import { ListTrainingTypeRequestDto } from '../dtos';

export interface ITrainingTypeRepository {
  create(athlete: TrainingTypeEntity): Promise<void>;
  list(query: ListTrainingTypeRequestDto): Promise<TrainingTypeEntity[]>;
  count(query: ListTrainingTypeRequestDto): Promise<number>;
  findByUuid(uuid: string): Promise<TrainingTypeEntity | null>;
  findAll(props: {
    coachId: number;
    isEnabled: boolean;
  }): Promise<TrainingTypeEntity[]>;
  update(athlete: TrainingTypeEntity): Promise<void>;
}
