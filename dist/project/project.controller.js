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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const constant_type_common_1 = require("../common/constant.type.common");
const fileUpload_common_1 = require("../common/fileUpload.common");
const platform_express_1 = require("@nestjs/platform-express");
const logger_service_1 = require("../logger/logger.service");
const update_project_dto_1 = require("./dto/update-project.dto");
const user_decorators_1 = require("../adm-user/decorators/user.decorators");
let ProjectController = class ProjectController {
    constructor(projectService, loggerService) {
        this.projectService = projectService;
        this.loggerService = loggerService;
    }
    async getAllAssignProject(userId) {
        try {
            const response = [
                {
                    project: {
                        projectId: 1,
                        projectNumber: "T0001",
                        projectName: "Coastal Survey",
                        description: "Coastal Survey project description.",
                        routeCode: "ABC123",
                        agencyName: "",
                        projectS3BucketFolderPath: "",
                        geoJsonS3FilePath: "Scope.geojson",
                        boundingBox: [],
                        regions: [],
                        projectKmlGeoJson: "",
                        isExportable: false,
                        projectDataExportUrl: "",
                        isEnableLens: false,
                        isEnablePlanner: false,
                        isEnableAnalytics: false,
                        roadViewEnabled: false,
                        viewerEnabled: false,
                    },
                    projectUserRoleId: 1,
                    roleId: 1,
                    isEnableLens: false,
                    isEnablePlanner: false,
                    isEnableAnalytics: false,
                },
                {
                    project: {
                        projectId: 2,
                        projectNumber: "T0002",
                        projectName: "Mountain Pine",
                        description: "Mountain Pine project description.",
                        routeCode: "DEF456",
                        agencyName: "",
                        projectS3BucketFolderPath: "",
                        geoJsonS3FilePath: "Scope.geojson",
                        boundingBox: [],
                        regions: [],
                        projectKmlGeoJson: "",
                        isExportable: false,
                        projectDataExportUrl: "",
                        isEnableLens: false,
                        isEnablePlanner: false,
                        isEnableAnalytics: false,
                        roadViewEnabled: false,
                        viewerEnabled: false,
                    },
                    projectUserRoleId: 2,
                    roleId: 1,
                    isEnableLens: false,
                    isEnablePlanner: false,
                    isEnableAnalytics: false,
                },
            ];
            return {
                message: "Assigned projects retrieved successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getAllProject() {
        try {
            const response = await this.projectService.getAllProjects({
                where: { isActive: true },
            });
            return {
                message: "All projects retrieved successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getAllActiveInactiveProject() {
        try {
            const response = await this.projectService.getAllProjects();
            return {
                message: "All projects retrieved successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getProjectById(projectId) {
        try {
            const response = (await this.projectService.getAllProjects({
                where: { projectId, isActive: true },
            }))[0];
            return {
                message: "Project retrieved successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async downloadFile(projectId) {
        try {
            const response = await this.projectService.downloadFile({
                where: {
                    projectId,
                    isExportable: true,
                },
            });
            return {
                message: "Project retrieved successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async createProject(userId, createProjectDto) {
        try {
            const checkProjectNumber = await this.projectService.checkProjectNumberExists(createProjectDto.projectNumber);
            if (checkProjectNumber) {
                return {
                    message: "Project number already exists",
                    data: [],
                    statusCode: 400,
                };
            }
            const checkProjectName = await this.projectService.checkProjectNameExists(createProjectDto.projectName);
            if (checkProjectName) {
                return {
                    message: "Project name already exists",
                    data: [],
                    statusCode: 400,
                };
            }
            const response = await this.projectService.createProject(createProjectDto, userId);
            return {
                message: "Project created successfully",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async updateDownloadStatus(body) {
        if (body?.projectId) {
            const { projectId } = body;
            const response = await this.projectService.updateDownloadStatus(projectId);
            return {
                message: "Project updated successfully",
                data: response,
                statusCode: 200,
            };
        }
    }
    async updateIsActiveStatus(body) {
        if (body?.projectId) {
            const { projectId, isActive } = body;
            const response = await this.projectService.updateIsActiveStatus(projectId, isActive);
            return {
                message: "Project updated successfully",
                data: response,
                statusCode: 200,
            };
        }
    }
    async updateProject(updateProjectDto) {
        try {
            if (updateProjectDto.projectNumber) {
                const checkProjectNumber = await this.projectService.checkProjectNumberExists(updateProjectDto.projectNumber);
                if (checkProjectNumber) {
                    return {
                        message: "Project number already exists",
                        data: [],
                        statusCode: 400,
                    };
                }
            }
            if (updateProjectDto.projectName) {
                const checkProjectName = await this.projectService.checkProjectNameExists(updateProjectDto.projectName);
                if (checkProjectName) {
                    return {
                        message: "Project name already exists",
                        data: [],
                        statusCode: 400,
                    };
                }
            }
            const response = await this.projectService.updateProject(updateProjectDto);
            return {
                message: "Project updated successfully",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async uploadFiles(files) {
        try {
            if (!files || files.length === 0) {
                return {
                    message: "No files uploaded",
                    data: [],
                    statusCode: 400,
                };
            }
            return {
                message: "Files uploaded successfully",
                data: {
                    files: files.map((file) => file.filename),
                },
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async updateBoundingBox() {
        try {
            const result = await this.projectService.updateBoundingBoxForAllProjects();
            return {
                message: result.message,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async updateWorkstations(projectId, body) {
        try {
            const result = await this.projectService.updateWorkstations(+projectId, body);
            return {
                message: result.message || "Workstations updated successfully",
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Get)("get-assigned-project"),
    __param(0, (0, user_decorators_1.User)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getAllAssignProject", null);
__decorate([
    (0, common_1.Get)("get-all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getAllProject", null);
__decorate([
    (0, common_1.Get)("get-all-active-inactive"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getAllActiveInactiveProject", null);
__decorate([
    (0, common_1.Get)("get-project-by-id"),
    __param(0, (0, common_1.Query)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProjectById", null);
__decorate([
    (0, common_1.Get)("download-file"),
    __param(0, (0, common_1.Query)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, user_decorators_1.User)("userId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "createProject", null);
__decorate([
    (0, common_1.Put)("update-download-status"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateDownloadStatus", null);
__decorate([
    (0, common_1.Put)("update-is-active-status"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateIsActiveStatus", null);
__decorate([
    (0, common_1.Put)("update"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Post)("upload-file"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("file", 1, (0, fileUpload_common_1.getMulterConfig)([".kml"], constant_type_common_1.UPLOAD_DIR))),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Post)("update-bounding-box"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateBoundingBox", null);
__decorate([
    (0, common_1.Put)("update-workstations/:projectId"),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateWorkstations", null);
exports.ProjectController = ProjectController = __decorate([
    (0, common_1.Controller)("project"),
    __metadata("design:paramtypes", [project_service_1.ProjectService,
        logger_service_1.LoggerService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map