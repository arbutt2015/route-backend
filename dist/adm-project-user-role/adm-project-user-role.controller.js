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
exports.AdmProjectUserRoleController = void 0;
const common_1 = require("@nestjs/common");
const adm_project_user_role_service_1 = require("./adm-project-user-role.service");
const create_update_dto_1 = require("./dto/create-update.dto");
const logger_service_1 = require("../logger/logger.service");
let AdmProjectUserRoleController = class AdmProjectUserRoleController {
    constructor(projectUserRoleService, loggerService) {
        this.projectUserRoleService = projectUserRoleService;
        this.loggerService = loggerService;
    }
    async getAllProjectRoles(projectId) {
        try {
            const response = await this.projectUserRoleService.getAllProjectUsersRoleWithSpecificFormate(projectId);
            return {
                message: "Project user role list",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async createProjectRole(data) {
        try {
            const { projectId: project, userId: user, roleId: role } = data;
            const response = await this.projectUserRoleService.createProjectUserRole({
                projectUserRoleId: data.projectUserRoleId,
                project,
                user,
                role,
            });
            return {
                message: "Project Role created successfully",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async deleteProjectRole(projectUserRoleId) {
        try {
            const response = await this.projectUserRoleService.deleteProjectUserRole(projectUserRoleId);
            return {
                message: "Project Role deleted successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getUsersByProjectAndRoleId(query) {
        const { projectId, roleCode } = query;
        try {
            const response = await this.projectUserRoleService.getUsersByProjectAndRoleId(projectId, roleCode);
            return {
                message: "Project user role list",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
};
exports.AdmProjectUserRoleController = AdmProjectUserRoleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdmProjectUserRoleController.prototype, "getAllProjectRoles", null);
__decorate([
    (0, common_1.Post)("add-update"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.CreateProjectUserRoleDto]),
    __metadata("design:returntype", Promise)
], AdmProjectUserRoleController.prototype, "createProjectRole", null);
__decorate([
    (0, common_1.Delete)("delete"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdmProjectUserRoleController.prototype, "deleteProjectRole", null);
__decorate([
    (0, common_1.Get)("get-users-by-project-role-id"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.GetUsersByProjectAndRoleIdDto]),
    __metadata("design:returntype", Promise)
], AdmProjectUserRoleController.prototype, "getUsersByProjectAndRoleId", null);
exports.AdmProjectUserRoleController = AdmProjectUserRoleController = __decorate([
    (0, common_1.Controller)("project-user-role"),
    __metadata("design:paramtypes", [adm_project_user_role_service_1.AdmProjectUserRoleService,
        logger_service_1.LoggerService])
], AdmProjectUserRoleController);
//# sourceMappingURL=adm-project-user-role.controller.js.map