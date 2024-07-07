import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAthleteDto {
  @IsString({ message: 'Nome não é uma string' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birthday: Date;

  @IsNumber({}, { message: 'Peso não é um número' })
  @IsOptional()
  weight?: number;

  @IsNumber({}, { message: 'Altura não é um número' })
  @IsOptional()
  height?: number;

  coachId: number;
}
