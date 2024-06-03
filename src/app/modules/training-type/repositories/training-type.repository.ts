import { PaginateRequestDto } from 'src/app/shared';
import { TrainingTypeEntity } from '../entities';

export interface ITrainingTypeRepository {
  create(athlete: TrainingTypeEntity): Promise<void>;
  findAll(query: PaginateRequestDto): Promise<TrainingTypeEntity[]>;
  count(query: PaginateRequestDto): Promise<number>;
}
