import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAthleteDto } from '../dtos';
import type { IAthleteRepository } from '../repositories';

@Injectable()
export class UpdateAthleteUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  async execute(uuid: string, data: UpdateAthleteDto): Promise<void> {
    const athlete = await this.athleteRepository.findByUuid(uuid);
    if (!athlete) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Atleta.',
        description: 'Verifique e tente novamente.',
      });
    }
    athlete.update(data);
    await this.athleteRepository.update(athlete);
  }
}
