import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/app/modules/user';
import { PrismaPGService } from '../prisma-pg.service';
import { IUserRepository } from 'src/app/modules/user/repositories';

@Injectable()
export class UserPostgresRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(user: UserEntity): Promise<void> {
    try {
      const email = user.getEmail();
      const name = user.getName();
      await this.prismaService.user.create({
        data: {
          email,
          name,
          password: user.getPassword(),
          firstAccess: user.getFirstAccess(),
          role: user.getRole(),
          coach: {
            create: {
              email,
              name,
            },
          },
        },
      });
    } catch (err) {
      throw new Error(
        'Não foi possível criar o usuário do treinador no banco de dados.',
      );
    }
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) return null;
    return new UserEntity(user);
  }

  public async findByUuid(uuid: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({ where: { uuid } });
    if (!user) return null;
    return new UserEntity(user);
  }
}
