import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingDto } from '../dtos';
import { TrainingEntity } from '../entities';
import type { ITrainingRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';
import type { ITrainingTypeRepository } from '../../training-type';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  async execute(input: CreateTrainingDto) {
    const {
      athleteUuid,
      trainingTypeUuid,
      date,
      duration,
      pse,
      psr,
      description,
    } = input;

    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const trainingType = await this.trainingTypeRepository.findByUuid(
      trainingTypeUuid,
    );

    if (!trainingType)
      throw new NotFoundException({
        title: 'Tipo de Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const training = new TrainingEntity({
      date,
      duration,
      pse,
      psr,
      description,
      athleteId: athlete.getId(),
      trainingTypeId: trainingType.getId(),
    });

    await this.trainingRepository.create(training);
  }
}
