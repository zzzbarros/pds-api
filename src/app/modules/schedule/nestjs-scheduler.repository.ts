import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IScheduleRepository } from './schedule.repository';
import { SendMailJob } from '../user/jobs';

@Injectable()
export class NestjsSchedulerRepository implements IScheduleRepository {
  constructor(private readonly sendMailJob: SendMailJob) {}

  // TODO:
  // @Cron(CronExpression.EVERY_2ND_HOUR)
  @Cron(CronExpression.EVERY_30_SECONDS)
  public async sendCreateUserEmail(): Promise<void> {
    console.log('CRONJOB ACIONADA!');
    await this.sendMailJob.execute();
  }
}
