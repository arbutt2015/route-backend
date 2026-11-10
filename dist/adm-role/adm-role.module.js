"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmRoleModule = void 0;
const common_1 = require("@nestjs/common");
const adm_role_controller_1 = require("./adm-role.controller");
const adm_role_service_1 = require("./adm-role.service");
const adm_role_repo_1 = require("./adm-role.repo");
const adm_role_feature_module_1 = require("../adm-role-feature/adm-role-feature.module");
const adm_feature_module_1 = require("../adm-feature/adm-feature.module");
const adm_module_module_1 = require("../adm-module/adm-module.module");
const graylog_common_1 = require("../common/graylog.common");
let AdmRoleModule = class AdmRoleModule {
};
exports.AdmRoleModule = AdmRoleModule;
exports.AdmRoleModule = AdmRoleModule = __decorate([
    (0, common_1.Module)({
        imports: [adm_role_feature_module_1.AdmRoleFeatureModule, adm_feature_module_1.AdmFeatureModule, adm_module_module_1.AdmModuleModule],
        controllers: [adm_role_controller_1.AdmRoleController],
        providers: [adm_role_service_1.AdmRoleService, adm_role_repo_1.AdmRoleRepo, graylog_common_1.LoggingService],
        exports: [adm_role_service_1.AdmRoleService],
    })
], AdmRoleModule);
//# sourceMappingURL=adm-role.module.js.map