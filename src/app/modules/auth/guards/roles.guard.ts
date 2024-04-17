import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../../user/entities/user.entity';
import { UserRole, rolesGuardMetaData } from 'src/app/shared';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  private matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[]>(
      rolesGuardMetaData,
      context.getHandler(),
    );

    if (!roles || !roles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    const userRole = user.getRole();

    return this.matchRoles(roles, userRole);
  }
}
