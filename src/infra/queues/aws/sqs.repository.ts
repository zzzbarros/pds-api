import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQS } from 'aws-sdk';
import { IQueueRepository } from 'src/app/modules/queues/queue.repository';

@Injectable()
export class QueueSQSRepository implements IQueueRepository {
  private SQS: SQS;
  private url: string;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get('AWS_SQS_QUEUE_URL');
    this.SQS = new SQS({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  public async sendMailToQueue({ email, name }) {
    try {
      await this.SQS.sendMessage({
        MessageBody: JSON.stringify({ email, name }),
        QueueUrl: this.url,
      }).promise();
    } catch (error) {
      this.onError();
    }
  }

  public async receiveMailFromQueue() {
    try {
      const response = await this.SQS.receiveMessage({
        QueueUrl: this.url,
      }).promise();
      const [message] = response.Messages;
      return {
        id: message.MessageId,
        body: JSON.parse(message.Body),
        receiptHandle: message.ReceiptHandle,
      };
    } catch (error) {
      this.onError();
    }
  }

  async removeMessage(receiptHandle: string): Promise<void> {
    try {
      await this.SQS.deleteMessage({
        QueueUrl: this.url,
        ReceiptHandle: receiptHandle,
      }).promise();
    } catch (error) {
      console.log('Error ao deletar mensagem da fila');
    }
  }

  private onError() {
    throw new UnprocessableEntityException({
      title: 'Não foi possível completar a ação!',
      message: 'Ocorreu um erro ao processar a fila de e-mail.',
    });
  }
}
