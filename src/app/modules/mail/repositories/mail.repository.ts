import { SendMailDto } from '../dtos';

export interface IMailRepository {
  sendMail(mailBody: SendMailDto): Promise<void>;
}
