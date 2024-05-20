import { ReceiveMailFromQueueDto, SendMailToQueueDto } from './queue.dto';

export interface IQueueRepository {
  sendMailToQueue(data: SendMailToQueueDto): Promise<void>;
  receiveMailFromQueue(): Promise<ReceiveMailFromQueueDto>;
  removeMessage(receiptHandle: string): Promise<void>;
}
