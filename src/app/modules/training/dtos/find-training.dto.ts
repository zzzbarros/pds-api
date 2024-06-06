import { IsDateString, IsString, IsUUID } from 'class-validator';

class Training {
  id: string;
  date: Date;
  trainingType: string;
  duration: number;
  pse: number;
  psr: number;
  description?: string;
}

export class FindTrainingRequestDto {
  @IsUUID('4', {
    message: 'Identificação do Atleta inválida.',
  })
  @IsString({ message: 'Identificação do Atleta não é uma string válida.' })
  athleteUuid: string;

  @IsDateString({}, { message: 'Data de inicial inválida.' })
  startDate: Date;

  @IsDateString({}, { message: 'Data de final inválida.' })
  endDate: Date;
}

export class FindTrainingResponseDto {
  trainings: Training[];
  charge: {
    week: number;
    previousWeek: number;
    nextWeek: number;
  };
  trainingTotals: {
    week: number;
    previousWeek: number;
    nextWeek: number;
  };
}
