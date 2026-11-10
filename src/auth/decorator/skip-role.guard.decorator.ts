import { SetMetadata } from "@nestjs/common";

export const SKIP_ROLES_GUARD_KEY = "skipRolesGuard";
export const SkipRolesGuard = () => SetMetadata(SKIP_ROLES_GUARD_KEY, true);
