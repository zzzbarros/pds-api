import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import type { IUserRepository } from '../repositories';
import type { ISecurityRepository } from '../../auth';
import type { IQueueRepository } from '../../queues';
import { EventsEnum, UserRoleEnum, type IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateUserUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(input: CreateUserDto): Promise<void> {
    const { name, email } = input;
    await this.validateEmailUniqueness(email);
    const role = UserRoleEnum.COACH;
    const password = await this.generatePassword();
    const user = new UserEntity({ name, email, password, role });
    const { id: userId } = await this.userRepository.create(user);
    await this.queueRepository.sendMailToQueue({
      email,
      name,
      userId,
    });
    this.eventEmitter.emit(EventsEnum.CREATE_USER, { userId, email, name });
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
}
