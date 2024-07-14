import { AthleteEntity } from '../entities';
import { ListAthletesRequestDto } from '../dtos';

export interface IAthleteRepository {
  create(athlete: AthleteEntity): Promise<void>;
  update(athlete: AthleteEntity): Promise<void>;
  findByEmail(email: string, coachId: number): Promise<AthleteEntity | null>;
  findAll(data: {
    isEnabled: boolean;
    not?: { emails: string[] };
  }): Promise<AthleteEntity[]>;
  listAll(query: ListAthletesRequestDto): Promise<AthleteEntity[]>;
  count(query: ListAthletesRequestDto): Promise<number>;
  findByUuid(uuid: string): Promise<AthleteEntity | null>;
}
