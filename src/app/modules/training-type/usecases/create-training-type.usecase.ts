import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateTrainingTypeDto } from '../dtos';
import { TrainingTypeEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingTypeRepository } from '../repositories';

@Injectable()
export class CreateTrainingTypeUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  async execute(input: CreateTrainingTypeDto): Promise<void> {
    // await this.valideEmail(input.email);
    const trainingType = new TrainingTypeEntity(input);
    await this.trainingTypeRepository.create(trainingType);
  }

  // private async valideEmail(email: string) {
  //   const existentEmail = await this.athleteRepository.findByEmail(email);
  //   if (existentEmail) {
  //     throw new ConflictException({
  //       title: 'E-mail já cadastrado. ',
  //       message:
  //         'Não foi possível cadastrar o atleta. Verifique e tente novamente...',
  //     });
  //   }
  // }
}
