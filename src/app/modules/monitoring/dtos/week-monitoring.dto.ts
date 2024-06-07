import { Transform } from 'class-transformer';
import { IsDateString, IsString, IsUUID } from 'class-validator';

export class WeekMonitoringRequestDto {
  @IsString()
  @IsUUID('4')
  athleteUuid: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}

export class WeekMonitoringResponseDto {
  days: Date[];
  PSRs: number[];
  durations: {
    planned: number[];
    performed: number[];
  };
  trainings: {
    planned: number[];
    performed: number[];
  };
  PSEs: {
    planned: number[];
    performed: number[];
  };
}
