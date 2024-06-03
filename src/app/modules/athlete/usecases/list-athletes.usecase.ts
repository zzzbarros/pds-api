import { Inject, Injectable } from '@nestjs/common';
import {
  PaginateRequestDto,
  PaginateResponseDto,
  type IBaseUseCase,
} from 'src/app/shared';
import { ListAthletesDto } from '../dtos';
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
  }: PaginateRequestDto): Promise<PaginateResponseDto<ListAthletesDto>> {
    const athletes = await this.athleteRepository.findAll({
      page,
      size,
      search,
    });

    const total = await this.athleteRepository.count({
      page,
      size,
      search,
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
