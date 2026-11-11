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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const project_repo_1 = require("./project.repo");
const aws_s3_service_1 = require("../aws/aws-s3.service");
const constant_type_common_1 = require("../common/constant.type.common");
const fileUpload_common_1 = require("../common/fileUpload.common");
const adm_project_user_role_service_1 = require("../adm-project-user-role/adm-project-user-role.service");
const adm_user_service_1 = require("../adm-user/adm-user.service");
const logger_service_1 = require("../logger/logger.service");
let ProjectService = class ProjectService {
    constructor(projectRepo, awsS3Service, admProjectUserRoleService, admUserService, loggerService) {
        this.projectRepo = projectRepo;
        this.awsS3Service = awsS3Service;
        this.admProjectUserRoleService = admProjectUserRoleService;
        this.admUserService = admUserService;
        this.loggerService = loggerService;
    }
    async getAllProjectByEmail(userId) {
        const results = await this.admProjectUserRoleService.getProjectByUserId(userId);
        return results.map((projectUser) => ({
            project: {
                projectId: projectUser.project.projectId,
                projectName: projectUser.project.projectName,
                projectNumber: `T${String(projectUser.project.projectId).padStart(4, "0")}`,
                description: projectUser.project.projectDescription,
                routeCode: `RT${String(projectUser.project.projectId).padStart(4, "0")}`,
                agencyName: projectUser.project.agency?.agencyName ?? "",
                agencyId: projectUser.project.agencyId,
                kmlFileUrl: projectUser.project.kmlFileUrl,
                geoJsonS3FilePath: projectUser.project.geoJsonFileUrl,
                collectedFileUrl: projectUser.project.collectedFileUrl,
                boundingBox: [],
                regions: [],
                projectKmlGeoJson: projectUser.project.geoJsonFileUrl,
                isExportable: Boolean(projectUser.project.collectedFileUrl),
                projectDataExportUrl: projectUser.project.collectedFileUrl ?? "",
                isEnableLens: false,
                isEnablePlanner: false,
                isEnableAnalytics: false,
                roadViewEnabled: false,
                viewerEnabled: true,
            },
            projectUserId: projectUser.userId,
        }));
    }
    async getAllProjects(filter, options) {
        return await this.projectRepo.getAllProjects(filter, options);
    }
    async getOneProjects(filter, options) {
        return await this.projectRepo.getOneProjects(filter, options);
    }
    async downloadFile(filter, options) {
        const result = await this.getOneProjects(filter, options);
        if (!result || !result.collectedFileUrl) {
            return { url: null };
        }
        return {
            url: await this.awsS3Service.getPresignedUrl(result.collectedFileUrl),
        };
    }
    async getAllProjectWithSpecificField() {
        const response = await this.getAllProjects({
            where: { isActive: true },
        });
        return response.map((item) => ({
            projectId: item?.projectId,
            projectName: item?.projectName,
            status: item?.isActive,
        }));
    }
    async createProject(createProject, userId) {
        const fileData = await (0, fileUpload_common_1.readFile)(`${constant_type_common_1.UPLOAD_DIR}/${createProject.shapeFileName}`);
        const fileResponse = await this.awsS3Service.createDirectoryORFileUpload(`${createProject.projectName}/${createProject.shapeFileName}`, fileData);
        const { kmlGeoJson } = await (0, fileUpload_common_1.convertKmlToGeoJson)(fileData);
        const fileNameWithGeoJsonExtension = (0, fileUpload_common_1.changeFileExtension)(createProject.shapeFileName, "geojson");
        const fileResponseGeoJson = await this.awsS3Service.createDirectoryORFileUpload(`${createProject.projectName}/kml-geojson-${fileNameWithGeoJsonExtension}`, kmlGeoJson);
        (0, fileUpload_common_1.deleteFile)(`${constant_type_common_1.UPLOAD_DIR}/${createProject.shapeFileName}`);
        const user = await this.admUserService.getUser({ where: { userId } });
        const project = await this.projectRepo.createProject({
            projectName: createProject.projectName,
            projectDescription: createProject.projectDescription,
            kmlFileUrl: fileResponse.Location,
            geoJsonFileUrl: fileResponseGeoJson.Location,
            collectedFileUrl: null,
            agencyId: createProject.agencyId ?? user?.agencyId ?? null,
            userId: userId ?? null,
            isActive: true,
        });
        await this.admProjectUserRoleService.createProjectUserRole({
            projectId: project.projectId,
            userId: userId,
        });
        return project;
    }
    async updateProject(updateProject) {
        let fileResponse;
        let fileResponseGeoJson;
        const existProject = (await this.getAllProjects({
            where: { projectId: updateProject.projectId },
        }))[0];
        if (updateProject?.shapeFileName) {
            await this.awsS3Service.deleteObject(existProject?.kmlFileUrl);
            await this.awsS3Service.deleteObject(existProject?.geoJsonFileUrl);
            const fileData = await (0, fileUpload_common_1.readFile)(`${constant_type_common_1.UPLOAD_DIR}/${updateProject.shapeFileName}`);
            fileResponse = await this.awsS3Service.createDirectoryORFileUpload(`${existProject?.projectName}/${updateProject.shapeFileName}`, fileData);
            const { kmlGeoJson } = await (0, fileUpload_common_1.convertKmlToGeoJson)(fileData);
            const fileNameWithGeoJsonExtension = (0, fileUpload_common_1.changeFileExtension)(updateProject.shapeFileName, "geojson");
            fileResponseGeoJson = await this.awsS3Service.createDirectoryORFileUpload(`${existProject?.projectName}/kml-geojson-${fileNameWithGeoJsonExtension}`, kmlGeoJson);
            (0, fileUpload_common_1.deleteFile)(`${constant_type_common_1.UPLOAD_DIR}/${updateProject.shapeFileName}`);
        }
        const project = await this.projectRepo.updateById(updateProject.projectId, {
            ...(updateProject.projectName
                ? { projectName: updateProject.projectName }
                : {}),
            ...(updateProject.projectDescription !== undefined
                ? { projectDescription: updateProject.projectDescription }
                : {}),
            ...(updateProject.agencyId !== undefined
                ? { agencyId: updateProject.agencyId }
                : {}),
            kmlFileUrl: fileResponse?.Location ?? existProject?.kmlFileUrl,
            geoJsonFileUrl: fileResponseGeoJson?.Location ?? existProject?.geoJsonFileUrl,
            dateUpdated: new Date(),
        });
        return project;
    }
    async updateIsActiveStatus(projectId, isActive) {
        return this.projectRepo.updateIsActiveStatus(projectId, isActive);
    }
    async checkProjectNameExists(projectName) {
        return this.projectRepo.checkProjectNameExists(projectName);
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_repo_1.ProjectRepo,
        aws_s3_service_1.AWSS3Service,
        adm_project_user_role_service_1.AdmProjectUserRoleService,
        adm_user_service_1.AdmUserService,
        logger_service_1.LoggerService])
], ProjectService);
//# sourceMappingURL=project.service.js.map