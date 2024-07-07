import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  MailQueueEnum,
  TokenTypeEnum,
  UserRoleEnum,
  type IBaseUseCase,
} from 'src/app/shared';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import {
  TokenEntity,
  type IRecoveryTokenRepository,
  type ISecurityRepository,
} from '../../auth';
import type { IQueueRepository } from '../../queues';
import type { IUserRepository } from '../repositories';

@Injectable()
export class CreateUserUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
    @Inject('IRecoveryTokenRepository')
    private readonly tokenRepository: IRecoveryTokenRepository,
  ) {}

  async execute(input: CreateUserDto): Promise<void> {
    const { name, email } = input;
    await this.validateEmailUniqueness(email);
    const role = UserRoleEnum.COACH;
    const password = await this.generatePassword();
    const user = new UserEntity({ name, email, password, role });
    const { id: userId } = await this.userRepository.create(user);
    const token = await this.createToken(userId);
    await this.queueRepository.sendMailToQueue({
      name,
      email,
      token: token.getToken(),
      type: MailQueueEnum.CREATE,
    });
  }

  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException({
        title: 'Não foi possível criar a conta!',
        message: 'Email do usuário já existe, verifique e tente novamente',
      });
    }
  }

  private async generatePassword() {
    return await this.securityRepository.hashPassword(randomUUID());
  }

  private async createToken(userId: number) {
    const tokenEntity = new TokenEntity({
      userId,
      isValid: true,
      type: TokenTypeEnum.recovery,
    });
    return await this.tokenRepository.save(tokenEntity);
  }
}
