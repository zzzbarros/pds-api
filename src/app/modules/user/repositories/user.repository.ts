import { UserEntity } from '../entities';

export interface IUserRepository {
  create(user: UserEntity): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUuid(uuid: string): Promise<UserEntity | null>;
}
