import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingRepository } from '../repositories';

@Injectable()
export class DeleteTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  async execute(uuid: string): Promise<void> {
    const training = await this.trainingRepository.findByUuid(uuid);

    if (!training)
      throw new NotFoundException({
        title: 'Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    await this.trainingRepository.delete(uuid);
  }
}
