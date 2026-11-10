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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmRoleFeatureController = void 0;
const common_1 = require("@nestjs/common");
const adm_role_feature_service_1 = require("./adm-role-feature.service");
const create_feature_dto_1 = require("./dto/create-feature.dto");
const logger_service_1 = require("../logger/logger.service");
const user_decorators_1 = require("../adm-user/decorators/user.decorators");
let AdmRoleFeatureController = class AdmRoleFeatureController {
    constructor(admRoleFeatureService, loggerService) {
        this.admRoleFeatureService = admRoleFeatureService;
        this.loggerService = loggerService;
    }
    async getAllRolesFeatures() {
        try {
            const response = await this.admRoleFeatureService.getAllRolesFeatures();
            return {
                message: "Roles features fetched successfully",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async create(createRoleWithFeaturesDto) {
        try {
            for (const feature of createRoleWithFeaturesDto.features) {
                await this.admRoleFeatureService.createRoleFeature({
                    roleId: createRoleWithFeaturesDto.roleId,
                    ...feature,
                });
            }
            return {
                message: "Role features created successfully",
                data: [],
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getRolesAndFeaturesByIds(userId, projectId) {
        try {
            const response = await this.admRoleFeatureService.getRolesFeaturesByRoleIdByProjectId(projectId, userId);
            return {
                message: "Roles and features fetched by project",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
};
exports.AdmRoleFeatureController = AdmRoleFeatureController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmRoleFeatureController.prototype, "getAllRolesFeatures", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_feature_dto_1.CreateFeatureDto]),
    __metadata("design:returntype", Promise)
], AdmRoleFeatureController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("get-by-project"),
    __param(0, (0, user_decorators_1.User)("userId")),
    __param(1, (0, common_1.Query)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdmRoleFeatureController.prototype, "getRolesAndFeaturesByIds", null);
exports.AdmRoleFeatureController = AdmRoleFeatureController = __decorate([
    (0, common_1.Controller)("role-feature"),
    __metadata("design:paramtypes", [adm_role_feature_service_1.AdmRoleFeatureService,
        logger_service_1.LoggerService])
], AdmRoleFeatureController);
//# sourceMappingURL=adm-role-feature.controller.js.map