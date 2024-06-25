import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsEnum, type IBaseUseCase } from 'src/app/shared';
import type { ITrainingRepository } from '../repositories';

@Injectable()
export class DeleteTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(uuid: string): Promise<void> {
    const training = await this.trainingRepository.findByUuid(uuid);

    if (!training)
      throw new NotFoundException({
        title: 'Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    await this.trainingRepository.delete(uuid);

    this.eventEmitter.emit(EventsEnum.UPDATE_WEEK_LOAD, {
      athleteId: training.getAthleteId(),
      date: training.getDate(),
    });
  }
}
