import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { USER_ROLE_ENUM } from 'src/app/shared';

export class CreateUserDto {
  @IsString({ message: 'Nome inválido' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  // @IsString({ message: 'A senha precisa ser uma string' })
  // @MinLength(8, { message: 'A senha precisa ter no mínimo 8 carácteres.' })
  // password: string;

  // @IsEnum(USER_ROLE_ENUM)
  // role?: USER_ROLE_ENUM;
}
