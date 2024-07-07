import { IsNumber, IsUUID } from 'class-validator';

export class CaptureAthleteWellBeingDto {
  @IsUUID('4')
  token: string;

  @IsNumber()
  sleep: number;

  @IsNumber()
  disposition: number;

  @IsNumber()
  musclePain: number;

  @IsNumber()
  stress: number;

  @IsNumber()
  humor: number;
}
