import { IsBoolean, IsString } from 'class-validator';

export class ListTrainingTypeDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  isEnabled: boolean;
}
