import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { LoginRequestDto } from '../dtos';
import { UserEntity } from '../../user';
import { IBaseUseCase } from 'src/app/shared';
import { ISecurityRepository } from '../repositories';
import { IUserRepository } from '../../user/repositories';

@Injectable()
export class LoginUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ISecurityRepository')
    private readonly hashRepository: ISecurityRepository,
  ) {}

  public async execute({
    email,
    password,
  }: LoginRequestDto): Promise<UserEntity> {
    const user = await this.validateUser(email);
    await this.validatePassword(password, user.getPassword());

    return user;
  }

  private async validateUser(email: string) {
    const user = await this.userRepository.findByEmail(email);

    const message = 'Verifique e tente novamente!';

    if (!user) {
      const title = 'Credenciais inválidas!';
      throw new BadRequestException({ title, message });
    }

    if (!user.getIsEnabled()) {
      const title = 'Usuário desabilitado!';
      throw new ForbiddenException({ title, message });
    }

    return user;
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const valid = await this.hashRepository.comparePasswords(
      password,
      hashedPassword,
    );

    if (!valid) {
      throw new BadRequestException({
        title: 'Não foi possível fazer o login!',
        message: 'Credenciais inválidas.',
      });
    }
  }
}
