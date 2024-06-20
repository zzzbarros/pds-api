import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindAthleteResponseDto {
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
