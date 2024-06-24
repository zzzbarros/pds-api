import { Module, forwardRef } from '@nestjs/common';
import { TrainingPlanningController } from './controllers';
import {
  CreateTrainingPlanningUseCase,
  DeleteTrainingPlanningUseCase,
  FindTrainingPlanningUseCase,
  UpdateTrainingPlanningUseCase,
} from './usecases';
import { TrainingPlanningRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/training-planning.repository';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingTypeModule } from '../training-type/training-type.module';

@Module({
  imports: [forwardRef(() => AthleteModule), TrainingTypeModule],
  controllers: [TrainingPlanningController],
  providers: [
    CreateTrainingPlanningUseCase,
    FindTrainingPlanningUseCase,
    UpdateTrainingPlanningUseCase,
    DeleteTrainingPlanningUseCase,
    {
      provide: 'ITrainingPlanningRepository',
      useClass: TrainingPlanningRepository,
    },
  ],
  exports: ['ITrainingPlanningRepository'],
})
export class TrainingPlanningModule {}
