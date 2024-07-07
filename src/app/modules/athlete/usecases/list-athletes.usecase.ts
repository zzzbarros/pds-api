import { Inject, Injectable } from '@nestjs/common';
import { PaginateResponseDto, type IBaseUseCase } from 'src/app/shared';
import { ListAthletesDto, ListAthletesRequestDto } from '../dtos';
import type { IAthleteRepository } from '../repositories';

@Injectable()
export class ListAthletesUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  async execute({
    page = 1,
    size = 10,
    search,
    coachId,
  }: ListAthletesRequestDto): Promise<PaginateResponseDto<ListAthletesDto>> {
    const athletes = await this.athleteRepository.findAll({
      page,
      size,
      search,
      coachId,
    });

    const total = await this.athleteRepository.count({
      page,
      size,
      search,
      coachId,
    });

    return new PaginateResponseDto<ListAthletesDto>({
      page,
      size,
      total,
      data: athletes.map((athlete) => ({
        id: athlete.getUuid(),
        name: athlete.getName(),
        email: athlete.getEmail(),
        isEnabled: athlete.getIsEnabled(),
      })),
    });
  }
}
