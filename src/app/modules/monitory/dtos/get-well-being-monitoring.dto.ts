import { IsDateString, IsString, IsUUID } from 'class-validator';

export class GetWellBeingMonitoringRequestDto {
  @IsString()
  @IsUUID('4')
  athleteUuid: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}

export class GetWellBeingMonitoringResponseDto {
  days: Date[];
  sleep: number[];
  disposition: number[];
  musclePain: number[];
  stress: number[];
  humor: number[];
}
