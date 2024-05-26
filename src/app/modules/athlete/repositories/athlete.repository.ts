import { AthleteEntity } from '../entities';

export interface IAthleteRepository {
  create(athlete: AthleteEntity): Promise<void>;
  findByEmail(email: string): Promise<AthleteEntity | null>;
  // list(): Promise<void>;
}
