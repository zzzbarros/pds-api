import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { NestjsSchedulerRepository } from './nestjs-scheduler.repository';
import { MonitoringModule } from '../monitory/monitoring.module';

@Module({
  imports: [NestScheduleModule.forRoot(), MonitoringModule],
  providers: [
    {
      provide: 'ICronRepository',
      useClass: NestjsSchedulerRepository,
    },
  ],
})
export class ScheduleModule {}
