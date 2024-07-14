import { IsDateString, IsString, IsUUID } from 'class-validator';

class TrainingPlanning {
  id: string;
  date: Date;
  trainingType: {
    id: string;
    name: string;
  };
  duration: number;
  pse: number;
  description?: string;
  load: number;
  finished: boolean;
}

export class FindTrainingPlanningRequestDto {
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

export class FindTrainingPlanningResponseDto {
  trainingPlanning: TrainingPlanning[];
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
