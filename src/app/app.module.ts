import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/infra/databases/orms/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { QueueModule } from './modules/queues/queue.module';
import { ScheduleModule } from './modules/schedule/cron.module';
import { SecurityModule } from 'src/infra/security/security.module';
import { MailModule } from './modules/mail/mail.module';
import { AthleteModule } from './modules/athlete/athlete.module';
import { TrainingTypeModule } from './modules/training-type/training-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      global: true,
    }),
    QueueModule,
    UserModule,
    PrismaModule,
    SecurityModule,
    ScheduleModule,
    MailModule,
    AthleteModule,
    TrainingTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
