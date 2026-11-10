"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmRoleService = void 0;
const common_1 = require("@nestjs/common");
const adm_role_repo_1 = require("./adm-role.repo");
const adm_role_feature_service_1 = require("../adm-role-feature/adm-role-feature.service");
const adm_module_service_1 = require("../adm-module/adm-module.service");
const adm_feature_service_1 = require("../adm-feature/adm-feature.service");
let AdmRoleService = class AdmRoleService {
    constructor(admRoleRepo, admRoleFeatureService, admModuleService, admFeatureService) {
        this.admRoleRepo = admRoleRepo;
        this.admRoleFeatureService = admRoleFeatureService;
        this.admModuleService = admModuleService;
        this.admFeatureService = admFeatureService;
    }
    async createRole(createRoleDto) {
        return await this.admRoleRepo.createRole(createRoleDto);
    }
    async getAllRoles(filter, options) {
        return await this.admRoleRepo.getAllRoles(filter, options);
    }
    async getRolesById(roleId) {
        let allFeatures = null;
        const moduleWithFeature = [];
        const allModules = await this.admModuleService.getAllModules({
            where: {
                moduleName: "Project",
            },
        });
        await Promise.all(allModules.map(async (module) => {
            allFeatures = await this.admFeatureService.getAllFeaturesByModuleId(module.moduleId);
            const roleWithFeature = [];
            await Promise.all(allFeatures.map(async (feature) => {
                const roleWithFeatureTemp = await this.admRoleFeatureService.getRolesAndFeaturesByIds(roleId, feature.featureId);
                if (roleWithFeatureTemp) {
                    roleWithFeature.push({
                        featureId: roleWithFeatureTemp.featureId,
                        featureName: feature.featureName,
                        createPermission: roleWithFeatureTemp.createPermission,
                        readPermissions: roleWithFeatureTemp.readPermissions,
                        updatePermission: roleWithFeatureTemp.updatePermission,
                        deletePermissions: roleWithFeatureTemp.deletePermissions,
                    });
                }
                else {
                    roleWithFeature.push({
                        featureId: feature.featureId,
                        featureName: feature.featureName,
                        createPermission: false,
                        readPermissions: false,
                        updatePermission: false,
                        deletePermissions: false,
                    });
                }
            }));
            moduleWithFeature.push({
                moduleId: module.moduleId,
                moduleName: module.moduleName,
                features: roleWithFeature,
            });
        }));
        return moduleWithFeature;
    }
    async deleteRole(roleId) {
        return await this.admRoleRepo.deleteRole({ roleId });
    }
};
exports.AdmRoleService = AdmRoleService;
exports.AdmRoleService = AdmRoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adm_role_repo_1.AdmRoleRepo,
        adm_role_feature_service_1.AdmRoleFeatureService,
        adm_module_service_1.AdmModuleService,
        adm_feature_service_1.AdmFeatureService])
], AdmRoleService);
//# sourceMappingURL=adm-role.service.js.map