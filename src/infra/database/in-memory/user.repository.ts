import { randomUUID } from 'crypto';
import { IUserRepository, UserEntity } from 'src/app/modules/user';

export class UserInMemoryRepository implements IUserRepository {
  private users: UserEntity[] = [];
  private ids = 1;

  async create(user: UserEntity): Promise<void> {
    user.setId(this.ids++);
    user.setUuid(randomUUID());
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.getEmail() === email);
    return user || null;
  }

  async findByUuid(uuid: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.getUuid() === uuid);
    return user || null;
  }
}
