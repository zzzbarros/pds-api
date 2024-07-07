import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateAthleteDto } from '../dtos';
import { AthleteEntity } from '../entities';
import type { IAthleteRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateAthleteUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  async execute(input: CreateAthleteDto): Promise<void> {
    await this.valideEmail(input.email, input.coachId);
    const athlete = new AthleteEntity(input);
    await this.athleteRepository.create(athlete);
  }

  private async valideEmail(email: string, coachId: number) {
    const existentEmail = await this.athleteRepository.findByEmail(
      email,
      coachId,
    );
    if (existentEmail) {
      throw new ConflictException({
        title: 'E-mail já cadastrado.',
        message:
          'Não foi possível cadastrar o atleta. Verifique e tente novamente...',
      });
    }
  }
}
