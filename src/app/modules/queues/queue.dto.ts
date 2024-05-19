export class SendMailToQueueDto {
  name: string;
  email: string;
}

export class ReceiveMailFromQueueDto {
  id: string;
  body: SendMailToQueueDto;
}
