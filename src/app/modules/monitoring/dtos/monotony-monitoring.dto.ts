import { IsDateString, IsString, IsUUID } from 'class-validator';

export class MonotonyMonitoringResponseDto {
  week: string[];
  monotony: number[];
  strain: number[];
  acuteChronicLoadRatio: number[];
  load: {
    planned: number[];
    performed: number[];
  };
}

export class MonotonyMonitoringRequestDto {
  @IsString()
  @IsUUID('4')
  athleteUuid: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}
