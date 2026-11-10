"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectUserRoleModule = void 0;
const common_1 = require("@nestjs/common");
const adm_project_user_role_controller_1 = require("./adm-project-user-role.controller");
const adm_project_user_role_service_1 = require("./adm-project-user-role.service");
const adm_project_user_role_repo_1 = require("./adm-project-user-role.repo");
let ProjectUserRoleModule = class ProjectUserRoleModule {
};
exports.ProjectUserRoleModule = ProjectUserRoleModule;
exports.ProjectUserRoleModule = ProjectUserRoleModule = __decorate([
    (0, common_1.Module)({
        controllers: [adm_project_user_role_controller_1.AdmProjectUserRoleController],
        providers: [adm_project_user_role_service_1.AdmProjectUserRoleService, adm_project_user_role_repo_1.AdmProjectUserRoleRepo],
        exports: [adm_project_user_role_service_1.AdmProjectUserRoleService],
    })
], ProjectUserRoleModule);
//# sourceMappingURL=adm-project-user-role.module.js.map