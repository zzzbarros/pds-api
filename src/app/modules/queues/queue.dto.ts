export class SendMailToQueueDto {
  name: string;
  email: string;
  userId: number;
}

export class ReceiveMailFromQueueDto {
  id: string;
  receiptHandle: string;
  body: SendMailToQueueDto;
}
