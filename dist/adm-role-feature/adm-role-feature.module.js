"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmRoleFeatureModule = void 0;
const common_1 = require("@nestjs/common");
const adm_role_feature_controller_1 = require("./adm-role-feature.controller");
const adm_role_feature_service_1 = require("./adm-role-feature.service");
const adm_role_feature_repo_1 = require("./adm-role-feature.repo");
const project_module_1 = require("../project/project.module");
const aws_s3_service_1 = require("../aws/aws-s3.service");
const adm_user_module_1 = require("../adm-user/adm-user.module");
const adm_project_user_role_module_1 = require("../adm-project-user-role/adm-project-user-role.module");
let AdmRoleFeatureModule = class AdmRoleFeatureModule {
};
exports.AdmRoleFeatureModule = AdmRoleFeatureModule;
exports.AdmRoleFeatureModule = AdmRoleFeatureModule = __decorate([
    (0, common_1.Module)({
        imports: [project_module_1.ProjectModule, adm_user_module_1.AdmUserModule, adm_project_user_role_module_1.ProjectUserRoleModule],
        controllers: [adm_role_feature_controller_1.AdmRoleFeatureController],
        providers: [adm_role_feature_service_1.AdmRoleFeatureService, adm_role_feature_repo_1.AdmRoleFeatureRepo, aws_s3_service_1.AWSS3Service],
        exports: [adm_role_feature_service_1.AdmRoleFeatureService],
    })
], AdmRoleFeatureModule);
//# sourceMappingURL=adm-role-feature.module.js.map