import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

export const rolesGuardMetaData = 'roles';
export const Roles = (...roles: UserRole[]) =>
  SetMetadata(rolesGuardMetaData, roles);
