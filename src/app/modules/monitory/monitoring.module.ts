import { Module, forwardRef } from '@nestjs/common';
import { MonitoringController } from './controllers';
import { MonotonyMonitoringUseCase, WeekMonitoringUseCase } from './usecases';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingPlanningModule } from '../training-planning/training-planning.module';
import { TrainingModule } from '../training/training.module';
import { UpdateWeekLoadListener } from './listeners';
import { MonitoryPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories';

@Module({
  controllers: [MonitoringController],
  imports: [
    forwardRef(() => AthleteModule),
    forwardRef(() => TrainingModule),
    forwardRef(() => TrainingPlanningModule),
  ],
  providers: [
    WeekMonitoringUseCase,
    MonotonyMonitoringUseCase,
    UpdateWeekLoadListener,
    {
      provide: 'IMonitoryRepository',
      useClass: MonitoryPostgresRepository,
    },
  ],
})
export class MonitoringModule {}
