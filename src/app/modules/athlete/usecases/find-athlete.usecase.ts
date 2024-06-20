import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IAthleteRepository } from '../repositories';
import { FindAthleteResponseDto } from '../dtos';

@Injectable()
export class FindAthleteUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  async execute(uuid: string): Promise<FindAthleteResponseDto> {
    const athlete = await this.athleteRepository.findByUuid(uuid);
    if (!athlete) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Atleta.',
        description: 'Verifique e tente novamente.',
      });
    }
    return {
      name: athlete.getName(),
      birthday: athlete.getBirthday(),
      email: athlete.getEmail(),
      height: athlete.getHeight(),
      weight: athlete.getWeight(),
    };
  }
}
