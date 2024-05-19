import { ReceiveMailFromQueueDto, SendMailToQueueDto } from './queue.dto';

interface MailFromQueueDto {}

export interface IQueueRepository {
  sendMailToQueue(data: SendMailToQueueDto): Promise<void>;
  receiveMailFromQueue(): Promise<ReceiveMailFromQueueDto>;
}
