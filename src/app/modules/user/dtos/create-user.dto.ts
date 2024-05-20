import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome inválido' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;
}
