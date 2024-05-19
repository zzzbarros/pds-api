import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { NestjsSchedulerRepository } from './nestjs-scheduler.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [NestScheduleModule.forRoot(), UserModule],
  providers: [
    {
      provide: 'ICronRepository',
      useClass: NestjsSchedulerRepository,
    },
  ],
})
export class ScheduleModule {}
