import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { LoginRequestDto } from '../dtos';
import { UserEntity, type IUserRepository } from '../../user';
import type { IBaseUseCase } from 'src/app/shared';
import type { ISecurityRepository } from '../repositories';

@Injectable()
export class LoginUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ISecurityRepository')
    private readonly hashRepository: ISecurityRepository,
  ) {}

  public async execute(input: LoginRequestDto): Promise<UserEntity> {
    const user = await this.validateUser(input);
    await this.validatePassword(input.password, user.getPassword());

    return user;
  }

  private async validateUser({ email }: LoginRequestDto) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      const message = 'Credenciais inválidas!';
      throw new BadRequestException(message);
    }

    if (!user.getIsEnabled()) {
      const message = 'Usuário desabilitado!';
      throw new ForbiddenException(message);
    }

    return user;
  }

  private async validatePassword(input: string, hashed: string) {
    const valid = await this.hashRepository.comparePasswords(input, hashed);

    if (!valid) {
      const message = 'Credenciais inválidas!';
      throw new BadRequestException(message);
    }
  }
}
