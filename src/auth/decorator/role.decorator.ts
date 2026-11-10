// src/auth/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { ACCESS_PERMISSIONS } from "../enum/role.enum";

export const ROLES_KEY = "roles";
export const Roles = (roles: ACCESS_PERMISSIONS) =>
  SetMetadata(ROLES_KEY, roles);
