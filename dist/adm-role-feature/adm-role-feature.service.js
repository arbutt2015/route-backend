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
exports.AdmRoleFeatureService = void 0;
const common_1 = require("@nestjs/common");
const adm_role_feature_repo_1 = require("./adm-role-feature.repo");
const adm_user_service_1 = require("../adm-user/adm-user.service");
const adm_project_user_role_service_1 = require("../adm-project-user-role/adm-project-user-role.service");
let AdmRoleFeatureService = class AdmRoleFeatureService {
    constructor(admRoleFeatureRepository, admUserService, admProjectUserRoleService) {
        this.admRoleFeatureRepository = admRoleFeatureRepository;
        this.admUserService = admUserService;
        this.admProjectUserRoleService = admProjectUserRoleService;
    }
    async createRoleFeature(createRoleWithFeaturesDto) {
        return await this.admRoleFeatureRepository.createRoleFeature(createRoleWithFeaturesDto);
    }
    async getAllRolesFeatures() {
        return await this.admRoleFeatureRepository.getAllRolesFeatures();
    }
    async getRolesAndFeaturesByIds(roleId, featureId, options) {
        return await this.admRoleFeatureRepository.getRolesAndFeaturesByIds({
            where: { roleId, featureId },
        }, options);
    }
    async getRolesFeaturesByRoleIdByProjectId(projectId, userId) {
        const results = await this.admProjectUserRoleService.getProjectByUserId(userId, projectId);
        const filteredResults = results.map((projectUserRole) => ({
            projectUserRoleId: projectUserRole.projectUserRoleId,
            roleId: projectUserRole.role.roleId,
            project: {
                projectId: projectUserRole.project.projectId,
                projectName: projectUserRole.project.projectName,
                agencyName: projectUserRole.project.agencyName,
                projectNumber: projectUserRole.project.projectNumber,
                projectKmlGeoJson: projectUserRole.project.projectKmlGeoJson,
                projectS3BucketFolderPath: projectUserRole.project.projectS3BucketFolderPath,
                geoJsonS3FilePath: projectUserRole.project.geoJsonS3FilePath,
                projectDataExportUrl: projectUserRole.project.projectDataExportUrl,
                isExportable: projectUserRole.project.isExportable,
                boundingBox: projectUserRole.project.boundingBox?.split(","),
                projectRegions: projectUserRole.project.projectRegions.map((region) => ({
                    regionId: region.regionId,
                    regionName: region.regionName,
                    regionCode: region.regionCode,
                    regionBaseShapeFilePath: region.regionBaseShapeFilePath,
                    regionKmlGeoJson: region.regionKmlGeoJson,
                    lockRegion: region.lockRegion,
                    projectRegionCollectionKml: region.projectRegionCollectionKmls.map((collection) => ({
                        ...collection,
                    })),
                })),
            },
        }));
        const roleFeature = await this.admRoleFeatureRepository.getRolesFeaturesByRoleId({
            where: { roleId: filteredResults[0]?.roleId },
        }, {
            relations: ["feature"],
        });
        return { roleFeature, projectWithRegion: filteredResults[0] };
    }
};
exports.AdmRoleFeatureService = AdmRoleFeatureService;
exports.AdmRoleFeatureService = AdmRoleFeatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adm_role_feature_repo_1.AdmRoleFeatureRepo,
        adm_user_service_1.AdmUserService,
        adm_project_user_role_service_1.AdmProjectUserRoleService])
], AdmRoleFeatureService);
//# sourceMappingURL=adm-role-feature.service.js.map