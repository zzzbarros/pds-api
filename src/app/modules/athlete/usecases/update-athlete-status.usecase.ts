import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IBaseUseCase } from 'src/app/shared';
import type { IAthleteRepository } from '../repositories';

@Injectable()
export class UpdateAthleteStatusUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  async execute(uuid: string): Promise<void> {
    const athlete = await this.athleteRepository.findByUuid(uuid);
    if (!athlete) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Atleta.',
        description: 'Verifique e tente novamente.',
      });
    }
    athlete.toggleIsEnabled();
    await this.athleteRepository.update(athlete);
  }
}
