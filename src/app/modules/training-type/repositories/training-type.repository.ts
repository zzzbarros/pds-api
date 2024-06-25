import { PaginateRequestDto } from 'src/app/shared';
import { TrainingTypeEntity } from '../entities';

export interface ITrainingTypeRepository {
  create(athlete: TrainingTypeEntity): Promise<void>;
  list(query: PaginateRequestDto): Promise<TrainingTypeEntity[]>;
  count(query: PaginateRequestDto): Promise<number>;
  findByUuid(uuid: string): Promise<TrainingTypeEntity | null>;
  findAll(props?: { isEnabled: boolean }): Promise<TrainingTypeEntity[]>;
  update(athlete: TrainingTypeEntity): Promise<void>;
}
