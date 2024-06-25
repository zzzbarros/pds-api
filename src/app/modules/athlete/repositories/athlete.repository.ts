import { PaginateRequestDto } from 'src/app/shared';
import { AthleteEntity } from '../entities';

export interface IAthleteRepository {
  create(athlete: AthleteEntity): Promise<void>;
  update(athlete: AthleteEntity): Promise<void>;
  findByEmail(email: string): Promise<AthleteEntity | null>;
  findAll(query: PaginateRequestDto): Promise<AthleteEntity[]>;
  count(query: PaginateRequestDto): Promise<number>;
  findByUuid(uuid: string): Promise<AthleteEntity | null>;
}
