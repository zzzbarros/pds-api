import { Module } from '@nestjs/common';
import { CreateAthleteUseCase } from './usecases';
import { AthleteController } from './controllers/athlete.controller';
import { AthletePostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/athlete.repository';

@Module({
  controllers: [AthleteController],
  providers: [
    CreateAthleteUseCase,
    {
      provide: 'IAthleteRepository',
      useClass: AthletePostgresRepository,
    },
  ],
})
export class AthleteModule {}
