import { Module } from '@nestjs/common';
import { TrainingTypeController } from './controllers';
import {
  CreateTrainingTypeUseCase,
  GetAllTrainingTypesUseCase,
  ListTrainingTypeUseCase,
} from './usecases';
import { TrainingTypePostgresRepository } from 'src/infra/databases/orms/prisma/postgres';

@Module({
  controllers: [TrainingTypeController],
  providers: [
    CreateTrainingTypeUseCase,
    ListTrainingTypeUseCase,
    GetAllTrainingTypesUseCase,
    {
      provide: 'ITrainingTypeRepository',
      useClass: TrainingTypePostgresRepository,
    },
  ],
  exports: ['ITrainingTypeRepository'],
})
export class TrainingTypeModule {}
