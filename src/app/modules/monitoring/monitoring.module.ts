import { Module, forwardRef } from '@nestjs/common';
import { MonitoringController } from './controllers';
import { MonotonyMonitoringUseCase, WeekMonitoringUseCase } from './usecases';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingPlanningModule } from '../training-planning/training-planning.module';
import { TrainingModule } from '../training/training.module';

@Module({
  controllers: [MonitoringController],
  imports: [
    forwardRef(() => AthleteModule),
    forwardRef(() => TrainingModule),
    forwardRef(() => TrainingPlanningModule),
  ],
  providers: [WeekMonitoringUseCase, MonotonyMonitoringUseCase],
})
export class MonitoringModule {}
