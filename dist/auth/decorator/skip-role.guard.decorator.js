"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipRolesGuard = exports.SKIP_ROLES_GUARD_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_ROLES_GUARD_KEY = "skipRolesGuard";
const SkipRolesGuard = () => (0, common_1.SetMetadata)(exports.SKIP_ROLES_GUARD_KEY, true);
exports.SkipRolesGuard = SkipRolesGuard;
//# sourceMappingURL=skip-role.guard.decorator.js.map