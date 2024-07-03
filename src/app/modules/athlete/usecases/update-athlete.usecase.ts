import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAthleteDto } from '../dtos';
import type { IAthleteRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class UpdateAthleteUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  async execute(data: UpdateAthleteDto): Promise<{ message: string }> {
    const { uuid } = data;
    const athlete = await this.athleteRepository.findByUuid(uuid);
    if (!athlete) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Atleta.',
        description: 'Verifique e tente novamente.',
      });
    }
    athlete.update(data);
    await this.athleteRepository.update(athlete);
    return { message: 'Atleta atualizado sucesso!' };
  }
}
