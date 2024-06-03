import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class ListAthletesDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isEnabled: boolean;
}
