import { Module, forwardRef } from '@nestjs/common';
import { TrainingController } from './controllers';
import { CreateTrainingUseCase, FindTrainingUseCase } from './usecases';
import { TrainingPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/training.repository';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingTypeModule } from '../training-type/training-type.module';

@Module({
  imports: [
    forwardRef(() => AthleteModule),
    forwardRef(() => TrainingTypeModule),
  ],
  controllers: [TrainingController],
  providers: [
    CreateTrainingUseCase,
    FindTrainingUseCase,
    {
      provide: 'ITrainingRepository',
      useClass: TrainingPostgresRepository,
    },
  ],
  exports: ['ITrainingRepository'],
})
export class TrainingModule {}
