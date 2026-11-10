// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./decorator/role.decorator";
import { ACCESS_PERMISSIONS } from "./enum/role.enum";
import { SKIP_ROLES_GUARD_KEY } from "./decorator/skip-role.guard.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipRolesGuard = this.reflector.getAllAndOverride<boolean>(
      SKIP_ROLES_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skipRolesGuard) {
      return true;
    }
    const roles = this.reflector.getAllAndOverride<ACCESS_PERMISSIONS>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!roles) {
      return true; // If no roles are specified, allow access
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request.user;

    return user[roles];
  }
}
