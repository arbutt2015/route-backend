"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const project_controller_1 = require("./project.controller");
const project_service_1 = require("./project.service");
const project_repo_1 = require("./project.repo");
const aws_s3_service_1 = require("../aws/aws-s3.service");
const axios_1 = require("@nestjs/axios");
const adm_user_module_1 = require("../adm-user/adm-user.module");
const adm_project_user_role_module_1 = require("../adm-project-user-role/adm-project-user-role.module");
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, adm_user_module_1.AdmUserModule, adm_project_user_role_module_1.ProjectUserRoleModule],
        controllers: [project_controller_1.ProjectController],
        providers: [project_service_1.ProjectService, project_repo_1.ProjectRepo, aws_s3_service_1.AWSS3Service],
        exports: [project_service_1.ProjectService],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map