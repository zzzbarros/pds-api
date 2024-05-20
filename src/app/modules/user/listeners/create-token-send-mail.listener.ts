import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventsEnum, TokenTypeEnum } from 'src/app/shared';
import { SendMailListenerDto } from '../dtos';
import { TokenEntity } from '../../auth';
import type { IMailRepository } from '../../mail';
import type { IQueueRepository } from '../../queues';
import type { IRecoveryTokenRepository } from '../../auth/repositories/recovery-token.repository';

@Injectable()
export class CreateTokenSendMailListener {
  constructor(
    @Inject('IMailRepository')
    private readonly mailRepository: IMailRepository,
    @Inject('IRecoveryTokenRepository')
    private readonly tokenRepository: IRecoveryTokenRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
  ) {}

  @OnEvent(EventsEnum.CREATE_USER, { async: true })
  async createTokenAndSendMail({ userId, email, name }: SendMailListenerDto) {
    try {
      const tokenEntity = new TokenEntity({
        userId,
        type: TokenTypeEnum.recovery,
        isValid: true,
      });

      const token = await this.tokenRepository.save(tokenEntity);

      await this.mailRepository.sendMail({
        email,
        name,
        token: token.getToken(),
        expiresIn: 24,
      });

      const messageFromQueue =
        await this.queueRepository.receiveMailFromQueue();

      await this.queueRepository.removeMessage(messageFromQueue.receiptHandle);
    } catch {
      console.log(
        'Erro ao criar o token de definição de senha e enviar e-mail para o usuário.',
      );
    }
  }
}
