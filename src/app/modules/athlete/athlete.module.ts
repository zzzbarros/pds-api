import { Module } from '@nestjs/common';
import {
  CreateAthleteUseCase,
  ListAthletesUseCase,
  FindAthleteUseCase,
  UpdateAthleteStatusUseCase,
  UpdateAthleteUseCase,
} from './usecases';
import { AthleteController } from './controllers/athlete.controller';
import { AthletePostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/athlete.repository';

@Module({
  controllers: [AthleteController],
  providers: [
    CreateAthleteUseCase,
    ListAthletesUseCase,
    FindAthleteUseCase,
    UpdateAthleteStatusUseCase,
    UpdateAthleteUseCase,
    {
      provide: 'IAthleteRepository',
      useClass: AthletePostgresRepository,
    },
  ],
  exports: ['IAthleteRepository'],
})
export class AthleteModule {}
