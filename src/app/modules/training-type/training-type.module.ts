import { Module } from '@nestjs/common';
import { TrainingTypeController } from './controllers';
import {
  CreateTrainingTypeUseCase,
  FindTrainingTypeUseCase,
  GetAllTrainingTypesUseCase,
  ListTrainingTypeUseCase,
  UpdateTrainingTypeStatusUseCase,
  UpdateTrainingTypeUseCase,
} from './usecases';
import { TrainingTypePostgresRepository } from 'src/infra/databases/orms/prisma/postgres';

@Module({
  controllers: [TrainingTypeController],
  providers: [
    CreateTrainingTypeUseCase,
    ListTrainingTypeUseCase,
    GetAllTrainingTypesUseCase,
    UpdateTrainingTypeUseCase,
    UpdateTrainingTypeStatusUseCase,
    FindTrainingTypeUseCase,
    {
      provide: 'ITrainingTypeRepository',
      useClass: TrainingTypePostgresRepository,
    },
  ],
  exports: ['ITrainingTypeRepository'],
})
export class TrainingTypeModule {}
