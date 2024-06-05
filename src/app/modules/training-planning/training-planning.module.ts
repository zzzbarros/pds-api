import { Module } from '@nestjs/common';
import { TrainingPlanningController } from './controllers';
import {
  CreateTrainingPlanningUseCase,
  FindTrainingPlanningUseCase,
} from './usecases';
import { TrainingPlanningRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/training-planning.repository';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingTypeModule } from '../training-type/training-type.module';

@Module({
  imports: [AthleteModule, TrainingTypeModule],
  controllers: [TrainingPlanningController],
  providers: [
    CreateTrainingPlanningUseCase,
    FindTrainingPlanningUseCase,
    {
      provide: 'ITrainingPlanningRepository',
      useClass: TrainingPlanningRepository,
    },
  ],
})
export class TrainingPlanningModule {}
