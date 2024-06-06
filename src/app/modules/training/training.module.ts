import { Module } from '@nestjs/common';
import { TrainingController } from './controllers';
import { CreateTrainingUseCase, FindTrainingUseCase } from './usecases';
import { TrainingRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/training.repository';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingTypeModule } from '../training-type/training-type.module';

@Module({
  imports: [AthleteModule, TrainingTypeModule],
  controllers: [TrainingController],
  providers: [
    CreateTrainingUseCase,
    FindTrainingUseCase,
    {
      provide: 'ITrainingRepository',
      useClass: TrainingRepository,
    },
  ],
})
export class TrainingModule {}
