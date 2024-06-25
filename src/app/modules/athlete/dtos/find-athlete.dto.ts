import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class FindAthleteResponseDto {
  @IsUUID('4')
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthday: Date;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;
}
