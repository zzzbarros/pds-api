import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { PaginateRequestDto } from 'src/app/shared';

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

export class ListAthletesRequestDto extends PaginateRequestDto {
  coachId: number;
}
