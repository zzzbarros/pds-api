import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTrainingDto } from '../dtos';
import { TrainingEntity } from '../entities';
import type { ITrainingRepository } from '../repositories';
import type { ITrainingTypeRepository } from '../../training-type';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class UpdateTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  async execute(input: UpdateTrainingDto) {
    const { id, trainingTypeUuid, date, duration, pse, description, psr } =
      input;

    const training = await this.trainingRepository.findByUuid(id);

    if (!training)
      throw new NotFoundException({
        title: 'Planejamento de treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    await this.validateTrainingType(training, trainingTypeUuid);

    training.update({
      date,
      duration,
      pse,
      description,
      psr,
    });

    console.log(training.getId());

    await this.trainingRepository.update(training);
  }

  private async validateTrainingType(
    training: TrainingEntity,
    trainingTypeUuid: string,
  ) {
    if (trainingTypeUuid !== training.getTrainingType().getUuid()) {
      const trainingType = await this.trainingTypeRepository.findByUuid(
        trainingTypeUuid,
      );

      if (!trainingType)
        throw new NotFoundException({
          title: 'Tipo de Treino não encontrado!',
          message: 'Verifique e tente novamente...',
        });

      training.updateTrainingTypeId(trainingType.getId());
    }
  }
}
