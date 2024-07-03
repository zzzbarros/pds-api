import { IsBoolean, IsString } from 'class-validator';
import { PaginateRequestDto } from 'src/app/shared';

export class ListTrainingTypeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  isEnabled: boolean;
}

export class ListTrainingTypeRequestDto extends PaginateRequestDto {
  coachId: number;
}
