import { Module, forwardRef } from '@nestjs/common';
import { MonitoringController } from './controllers';
import {
  SendWellBeingToAthletesUseCase,
  CaptureAthleteWellBeingUseCase,
  MonotonyMonitoringUseCase,
  WeekMonitoringUseCase,
} from './usecases';
import { UpdateWeekLoadListener } from './listeners';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingModule } from '../training/training.module';
import { QueueModule } from '../queues/queue.module';
import { TrainingPlanningModule } from '../training-planning/training-planning.module';
import { MonitoryPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories';
import { WellBeingPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/well-being.repository';
import { MonitoryTokenPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/monitory-token.repository';

@Module({
  controllers: [MonitoringController],
  imports: [
    QueueModule,
    forwardRef(() => AthleteModule),
    forwardRef(() => TrainingModule),
    forwardRef(() => TrainingPlanningModule),
  ],
  providers: [
    WeekMonitoringUseCase,
    MonotonyMonitoringUseCase,
    UpdateWeekLoadListener,
    SendWellBeingToAthletesUseCase,
    CaptureAthleteWellBeingUseCase,
    {
      provide: 'IMonitoryRepository',
      useClass: MonitoryPostgresRepository,
    },
    {
      provide: 'IWellBeingRepository',
      useClass: WellBeingPostgresRepository,
    },
    {
      provide: 'IMonitoryTokenRepository',
      useClass: MonitoryTokenPostgresRepository,
    },
  ],
  exports: [SendWellBeingToAthletesUseCase],
})
export class MonitoringModule {}
