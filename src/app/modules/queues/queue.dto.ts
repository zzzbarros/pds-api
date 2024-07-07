import { MailQueueEnum } from 'src/app/shared';

export class SendMailToQueueDto {
  name: string;
  email: string;
  token: string;
  type: MailQueueEnum;
}

export class ReceiveMailFromQueueDto {
  id: string;
  receiptHandle: string;
  body: SendMailToQueueDto;
}
