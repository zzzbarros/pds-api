import { UserRole } from 'src/app/shared';

export interface JwtPayloadDto {
  userId: string;
  type: UserRole;
}
