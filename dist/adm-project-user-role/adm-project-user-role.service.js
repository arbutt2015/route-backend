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
exports.AdmProjectUserRoleService = void 0;
const common_1 = require("@nestjs/common");
const adm_project_user_role_repo_1 = require("./adm-project-user-role.repo");
let AdmProjectUserRoleService = class AdmProjectUserRoleService {
    constructor(projectUserRoleRepo) {
        this.projectUserRoleRepo = projectUserRoleRepo;
    }
    async createProjectUserRole(createProjectUserRoleDto) {
        return await this.projectUserRoleRepo.createProjectUserRole(createProjectUserRoleDto);
    }
    async getAllProjectUsersRoles(filter, options) {
        return await this.projectUserRoleRepo.getAllProjectUsersRoles(filter, options);
    }
    async getAllProjectUsersRoleWithSpecificFormate(projectId) {
        const response = await this.getAllProjectUsersRoles({
            where: {
                project: {
                    projectId,
                },
            },
        }, {
            relations: ["user", "role"],
        });
        return response.map((projectUserRole) => {
            return {
                projectUserRoleId: projectUserRole.projectUserRoleId,
                userId: projectUserRole.user.userId,
                email: projectUserRole.user.email,
                firstName: projectUserRole.user.firstName,
                lastName: projectUserRole.user.lastName,
                roleId: projectUserRole.role.roleId,
                roleName: projectUserRole.role.roleName,
            };
        });
    }
    async getUsersByProjectAndRoleId(projectId, roleCode) {
        const response = await this.getAllProjectUsersRoles({
            where: {
                project: {
                    projectId,
                },
                role: {
                    roleCode,
                },
            },
        }, {
            relations: ["user"],
        });
        return response.map((projectUserRole) => {
            return {
                projectUserRoleId: projectUserRole.projectUserRoleId,
                userId: projectUserRole.user.userId,
                email: projectUserRole.user.email,
                firstName: projectUserRole.user.firstName,
                lastName: projectUserRole.user.lastName,
            };
        });
    }
    async deleteProjectUserRole(projectUserRoleId) {
        return await this.projectUserRoleRepo.deleteProjectUserRole(projectUserRoleId);
    }
    async getProjectByUserId(userId, projectId) {
        return await this.getAllProjectUsersRoles({
            where: {
                user: {
                    userId: userId,
                },
                project: {
                    projectId: projectId,
                    isActive: true,
                },
            },
        }, {
            select: [
                "role.roleId",
                "project.projectId",
                "project.projectNumber",
                "project.projectS3BucketFolderPath",
                "project.projectName",
            ],
            relations: [
                "project",
                "project.projectRegions",
                "project.projectRegions.pipelineRegionStatuses",
                "project.projectRegions.projectRegionCollectionKmls",
                "role",
            ],
        });
    }
};
exports.AdmProjectUserRoleService = AdmProjectUserRoleService;
exports.AdmProjectUserRoleService = AdmProjectUserRoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adm_project_user_role_repo_1.AdmProjectUserRoleRepo])
], AdmProjectUserRoleService);
//# sourceMappingURL=adm-project-user-role.service.js.map