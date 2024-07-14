import { Inject, Injectable } from '@nestjs/common';
import { TokenEntity } from '../../auth';
import {
  MailQueueEnum,
  TokenTypeEnum,
  type IBaseUseCase,
} from 'src/app/shared';
import type { IAthleteRepository } from '../../athlete';
import type { IQueueRepository } from '../../queues';
import type { IMonitoryTokenRepository } from '../repositories';
import type { IUnsubscribeRepository } from '../../unsubscribe';

@Injectable()
export class SendWellBeingToAthletesUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
    @Inject('IMonitoryTokenRepository')
    private readonly monitoryTokenRepository: IMonitoryTokenRepository,
    @Inject('IUnsubscribeRepository')
    private readonly unsubscribeRepository: IUnsubscribeRepository,
  ) {}

  async execute() {
    const unsubscribes = await this.unsubscribeRepository.findEmails();
    const athletes = await this.athleteRepository.findAll({
      isEnabled: true,
      not: { emails: unsubscribes },
    });
    if (!athletes.length) return;

    await this.monitoryTokenRepository.invalidateTokensByUserIds(
      athletes.map((athlete) => athlete.getId()),
    );

    const { messages, tokens } = athletes.reduce(
      (acc, athlete) => {
        const token = new TokenEntity({
          userId: athlete.getId(),
          type: TokenTypeEnum.MONITORY,
        });

        const message = {
          email: athlete.getEmail(),
          name: athlete.getName(),
          token: token.getToken(),
          type: MailQueueEnum.MONITORY,
        };

        acc.tokens.push(token);
        acc.messages.push(message);

        return acc;
      },
      { messages: [], tokens: [] },
    );

    await this.monitoryTokenRepository.saveBatch(tokens);
    await this.queueRepository.sendBatchMailToQueue(messages);
  }
}
