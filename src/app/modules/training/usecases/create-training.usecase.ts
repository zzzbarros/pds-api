import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingDto } from '../dtos';
import { TrainingEntity } from '../entities';
import type { ITrainingRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';
import type { ITrainingTypeRepository } from '../../training-type';
import { EventsEnum, type IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
    private readonly eventEmitter: EventEmitter2,
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

    const athleteId = athlete.getId();
    const trainingTypeId = trainingType.getId();

    const training = new TrainingEntity({
      date,
      duration,
      pse,
      psr,
      description,
      athleteId,
      trainingTypeId,
    });

    await this.trainingRepository.create(training);

    this.eventEmitter.emit(EventsEnum.UPDATE_WEEK_LOAD, {
      athleteId,
      date,
    });
  }
}
