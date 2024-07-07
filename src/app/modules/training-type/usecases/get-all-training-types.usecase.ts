import { Inject, Injectable } from '@nestjs/common';
import { GetAllTrainingTypesDto } from '../dtos';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingTypeRepository } from '../repositories';

@Injectable()
export class GetAllTrainingTypesUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  async execute(coachId: number): Promise<GetAllTrainingTypesDto> {
    const trainingTypes = await this.trainingTypeRepository.findAll({
      coachId,
      isEnabled: true,
    });

    return {
      trainingTypes: trainingTypes.map((trainingType) => ({
        label: trainingType.getName(),
        value: trainingType.getUuid(),
      })),
    };
  }
}
