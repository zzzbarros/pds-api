import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { IUserRepository } from '../repositories';
import { ISecurityRepository } from '../../auth';
import { IQueueRepository } from '../../queues';
import { USER_ROLE_ENUM, type BaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateUserUseCase implements BaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly IUserRepository: IUserRepository,
    @Inject('IQueueRepository')
    private readonly IQueueRepository: IQueueRepository,
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(input: CreateUserDto): Promise<void> {
    const { name, email } = input;
    await this.validateEmailUniqueness(email);
    const role = USER_ROLE_ENUM.COACH;
    const password = await this.generatePassword();
    const user = new UserEntity({ name, email, password, role });
    await this.IUserRepository.create(user);
    await this.IQueueRepository.sendMailToQueue({ email, name });
  }

  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.IUserRepository.findByEmail(email);
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
}
