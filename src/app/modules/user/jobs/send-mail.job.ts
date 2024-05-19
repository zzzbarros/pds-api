import { Inject, Injectable } from '@nestjs/common';
import { IQueueRepository } from '../../queues/queue.repository';
import { IMailRepository } from '../../mail/repositories/mail.repository';

@Injectable()
export class SendMailJob {
  constructor(
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
    @Inject('IMailRepository')
    private readonly mailRepository: IMailRepository,
  ) {}

  async execute(): Promise<void> {
    // const message = await this.queueRepository.receiveMailFromQueue();
    const message = {
      id: 'IHU123444',
      body: { email: 'doublezbarros@gmail.com', name: 'José' },
    };
    console.log(message);
    await this.mailRepository.sendMail({
      email: message.body.email,
      subject: message.body.name,
    });
    console.log(message);
  }
}
