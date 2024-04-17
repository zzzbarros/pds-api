import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import type { IUserRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';
import type { ISecurityRepository } from '../../auth/repositories';

@Injectable()
export class CreateUserUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('ISecurityRepository')
    private readonly hashRepository: ISecurityRepository,
  ) {}

  async execute(input: CreateUserDto): Promise<void> {
    await this.validateEmailUniqueness(input.email);
    const hashedPassword = await this.hashRepository.hashPassword(
      input.password,
    );
    const user = new UserEntity({ ...input, password: hashedPassword });
    await this.userRepository.create(user);
  }

  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email do usuário já existe');
    }
  }
}
