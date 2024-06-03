import { Module } from '@nestjs/common';
import { TrainingTypeController } from './controllers';
import { CreateTrainingTypeUseCase, ListTrainingTypeUseCase } from './usecases';
import { TrainingTypePostgresRepository } from 'src/infra/databases/orms/prisma/postgres';

@Module({
  controllers: [TrainingTypeController],
  providers: [
    CreateTrainingTypeUseCase,
    ListTrainingTypeUseCase,
    {
      provide: 'ITrainingTypeRepository',
      useClass: TrainingTypePostgresRepository,
    },
  ],
})
export class TrainingTypeModule {}
