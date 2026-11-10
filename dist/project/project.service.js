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
const axios_1 = require("@nestjs/axios");
const project_repo_1 = require("./project.repo");
const aws_s3_service_1 = require("../aws/aws-s3.service");
const constant_type_common_1 = require("../common/constant.type.common");
const fileUpload_common_1 = require("../common/fileUpload.common");
const fs = require("fs");
const path = require("path");
const rxjs_1 = require("rxjs");
const adm_project_user_role_service_1 = require("../adm-project-user-role/adm-project-user-role.service");
const config_1 = require("@nestjs/config");
const logger_service_1 = require("../logger/logger.service");
let ProjectService = class ProjectService {
    constructor(projectRepo, awsS3Service, configService, admProjectUserRoleService, httpService, loggerService) {
        this.projectRepo = projectRepo;
        this.awsS3Service = awsS3Service;
        this.configService = configService;
        this.admProjectUserRoleService = admProjectUserRoleService;
        this.httpService = httpService;
        this.loggerService = loggerService;
    }
    async getAllProjectByEmail(userId) {
        const results = await this.admProjectUserRoleService.getProjectByUserId(userId);
        return results.map((projectUserRole) => ({
            project: {
                projectId: projectUserRole.project.projectId,
                projectName: projectUserRole.project.projectName,
                projectNumber: projectUserRole.project.projectNumber,
                isEnableLens: projectUserRole.project.projectRegions?.some((region) => region.pipelineRegionStatuses?.some((status) => status.lensStatus === 2)) ?? false,
                isEnablePlanner: projectUserRole.project.projectRegions?.some((region) => region.pipelineRegionStatuses?.some((status) => status.plannerStatus === 2)) ?? false,
                isEnableAnalytics: projectUserRole.project.projectRegions?.some((region) => region.pipelineRegionStatuses?.some((status) => status.analyticsStatus)) ?? false,
                viewerEnabled: projectUserRole.project.projectRegions?.some((region) => region.pipelineRegionStatuses?.some((status) => status.viewerStatus === 2)) ?? false,
                roadViewEnabled: projectUserRole.project.projectRegions?.some((region) => region.pipelineRegionStatuses?.some((status) => status.roadViewStatus === 2)) ?? false,
            },
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
        if (!result || result.projectDataExportUrl === "") {
            return { url: null };
        }
        return {
            url: await this.awsS3Service.getPresignedUrl(result.projectDataExportUrl),
        };
    }
    async getAllProjectsForCollector(projectId, userId) {
        const result = await this.projectRepo.getAllProjectsForCollector(projectId, userId);
        return this.extractRegionAndAreaInfo(result);
    }
    async projectDetailCount(projectId, userId) {
        const result = await this.projectRepo.getAllProjectsForCollector(projectId, userId);
        return this.extractRegionAndAreaInfoCount(result);
    }
    async getAllProjectsGeoJSON(projectId, userId) {
        const result = await this.projectRepo.getAllProjectsForCollector(projectId, userId);
        const formattedResult = await Promise.all(result.projectRegions.map(async (projectRegions) => {
            return {
                regionId: projectRegions.regionId,
                regionName: projectRegions.regionName,
                projectRegionCollectionKmls: await Promise.all(projectRegions.projectRegionCollectionKmls.map(async (collection) => ({
                    regionCollectionKmlId: collection.regionCollectionKmlId,
                    collectionName: collection.collectionName,
                    collectionKmlGeoJson: JSON.stringify(JSON.parse((await this.awsS3Service.getFileFromS3(collection.collectionKmlGeoJsonPath)).Body.toString("utf-8"))),
                    projectRegionAreas: await Promise.all(collection.projectRegionAreas.map(async (area) => ({
                        areaId: area.areaId,
                        areaName: area.areaName,
                        intervalType: area.intervalType,
                        intervalValue: area.intervalValue,
                        areaPolygonFilePath: area.areaPolygonFilePath,
                        areaGeoJson: area.areaPolygonFilePath
                            ? JSON.stringify(JSON.parse((await this.awsS3Service.getFileFromS3(area.areaPolygonFilePath)).Body.toString("utf-8")))
                            : null,
                        round: area.round,
                        missingGeoJson: area.missingGeoJsonPath
                            ? JSON.stringify(JSON.parse((await this.awsS3Service.getFileFromS3(area.missingGeoJsonPath)).Body.toString("utf-8")))
                            : null,
                    }))),
                }))),
            };
        }));
        return formattedResult;
    }
    async getAllProjectWithSpecificField() {
        const response = await this.getAllProjects({
            where: { isActive: true },
        });
        return response.map((item) => ({
            projectId: item?.projectId,
            projectName: item?.projectName,
            projectNumber: item?.projectNumber,
            projectS3BucketFolderPath: item?.projectS3BucketFolderPath,
            status: item?.isActive,
        }));
    }
    async createProject(createProject, userId) {
        const geoJson = await this.getGeoJSON(createProject.projectCountry, createProject.projectStateCode, createProject.projectNumber);
        const fileData = await (0, fileUpload_common_1.readFile)(`${constant_type_common_1.UPLOAD_DIR}/${createProject.shapeFileName}`);
        const fileResponse = await this.awsS3Service.createDirectoryORFileUpload(`${createProject.projectNumber}/${createProject.shapeFileName}`, fileData);
        const { boundingBox, kmlGeoJson } = await (0, fileUpload_common_1.convertKmlToGeoJson)(fileData);
        const fileNameWithGeoJsonExtension = (0, fileUpload_common_1.changeFileExtension)(createProject.shapeFileName, "geojson");
        const fileResponseGeoJson = await this.awsS3Service.createDirectoryORFileUpload(`${createProject.projectNumber}/kml-geojson-${fileNameWithGeoJsonExtension}`, kmlGeoJson);
        (0, fileUpload_common_1.deleteFile)(`${constant_type_common_1.UPLOAD_DIR}/${createProject.shapeFileName}`);
        const project = await this.projectRepo.createProject({
            ...createProject,
            shapeFileUrl: fileResponse.Location,
            projectS3Bucket: this.awsS3Service.S3_BUCKET_ROOT_FOLDER,
            projectS3BucketFolderPath: `${createProject.projectNumber}/`,
            boundingBox,
            geoJsonS3FilePath: geoJson.fileS3Location,
            projectKmlGeoJson: fileResponseGeoJson.Location,
            createByUserId: userId,
        });
        if (this.configService.get("DEFAULT_ROLE_ID") !== 0)
            await this.admProjectUserRoleService.createProjectUserRole({
                user: userId,
                project: project.projectId,
                role: this.configService.get("DEFAULT_ROLE_ID"),
            });
        return project;
    }
    async updateProject(updateProject) {
        let fileData;
        let fileResponse;
        let fileResponseGeoJson;
        let boundingBoxData;
        const existProject = (await this.getAllProjects({
            where: { projectId: updateProject.projectId },
        }))[0];
        const projectNumber = updateProject?.projectNumber ?? existProject?.projectNumber;
        const projectCountry = updateProject?.projectCountry ?? existProject?.projectCountry;
        const projectStateCode = updateProject?.projectStateCode ?? existProject?.projectStateCode;
        await this.awsS3Service.deleteObject(existProject?.geoJsonS3FilePath);
        const geoJson = await this.getGeoJSON(projectCountry, projectStateCode, projectNumber);
        if (updateProject?.shapeFileName) {
            await this.awsS3Service.deleteObject(existProject?.shapeFileUrl);
            await this.awsS3Service.deleteObject(existProject?.projectKmlGeoJson);
            fileData = await (0, fileUpload_common_1.readFile)(`${constant_type_common_1.UPLOAD_DIR}/${updateProject.shapeFileName}`);
            fileResponse = await this.awsS3Service.createDirectoryORFileUpload(`${projectNumber}/${updateProject.shapeFileName}`, fileData);
            const { boundingBox, kmlGeoJson } = await (0, fileUpload_common_1.convertKmlToGeoJson)(fileData);
            boundingBoxData = boundingBox;
            const fileNameWithGeoJsonExtension = (0, fileUpload_common_1.changeFileExtension)(updateProject.shapeFileName, "geojson");
            fileResponseGeoJson = await this.awsS3Service.createDirectoryORFileUpload(`${projectNumber}/kml-geojson-${fileNameWithGeoJsonExtension}`, kmlGeoJson);
            (0, fileUpload_common_1.deleteFile)(`${constant_type_common_1.UPLOAD_DIR}/${updateProject.shapeFileName}`);
        }
        const { projectId, shapeFileName, ...restOfUpdateProject } = updateProject;
        const boundingBoxToUse = boundingBoxData ?? geoJson?.boundingBox;
        const project = await this.projectRepo.updateById(projectId, {
            ...restOfUpdateProject,
            shapeFileUrl: fileResponse?.Location,
            projectS3BucketFolderPath: `${projectNumber}/`,
            boundingBox: boundingBoxToUse,
            geoJsonS3FilePath: geoJson?.fileS3Location,
            projectKmlGeoJson: fileResponseGeoJson?.Location,
        });
        return project;
    }
    async checkProjectNumberExists(projectNumber) {
        return this.projectRepo.checkProjectNumberExists(projectNumber);
    }
    async updateDownloadStatus(projectId) {
        return this.projectRepo.updateDownloadStatus(projectId);
    }
    async updateIsActiveStatus(projectId, isActive) {
        return this.projectRepo.updateIsActiveStatus(projectId, isActive);
    }
    async checkProjectNameExists(projectName) {
        return this.projectRepo.checkProjectNameExists(projectName);
    }
    async getGeoJSON(country, stateCode, s3Path) {
        let url = constant_type_common_1.NOMINATIM_URL;
        url = url.replace("COUNTRY", country);
        url = url.replace("STATE_CODE", stateCode);
        this.loggerService.log({ url });
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url, {
            headers: {
                "User-Agent": "transconomy/1.0",
            },
        }));
        const data = response.data;
        if (data.length === 0) {
            throw new Error("Location not found");
        }
        let boundingBox = "";
        const geojson = {
            type: "FeatureCollection",
            features: data.map((place) => {
                boundingBox = `${place.boundingbox[0]},${place.boundingbox[1]},${place.boundingbox[2]},${place.boundingbox[3]}`;
                return {
                    type: "Feature",
                    properties: {
                        name: place.display_name,
                    },
                    geometry: place.geojson,
                };
            }),
        };
        const fileName = `geojson-${Date.now()}.geojson`;
        const filePath = path.join(constant_type_common_1.UPLOAD_DIR, fileName);
        fs.writeFileSync(filePath, JSON.stringify(geojson));
        const fileData = fs.readFileSync(filePath);
        const s3Response = await this.awsS3Service.createDirectoryORFileUpload(`${s3Path}/${fileName}`, fileData);
        (0, fileUpload_common_1.deleteFile)(filePath);
        return {
            fileS3Location: s3Response.Location,
            boundingBox: boundingBox,
        };
    }
    async extractRegionAndAreaInfo(originalData) {
        return {
            details: await Promise.all(originalData.projectRegions.map(async (region) => ({
                regionId: region.regionId,
                regionName: region.regionName,
                projectRegionCollectionKmls: await Promise.all(region.projectRegionCollectionKmls.map(async (collection) => ({
                    regionCollectionKmlId: collection.regionCollectionKmlId,
                    collectionName: collection.collectionName,
                    folderPath: `https://${this.awsS3Service.S3_BUCKET_ROOT_FOLDER}.s3.amazonaws.com/${originalData.projectS3BucketFolderPath}${region.regionCode}/Input/Media`,
                    folderPathAppData: `https://${this.awsS3Service.S3_BUCKET_ROOT_FOLDER}.s3.amazonaws.com/${originalData.projectS3BucketFolderPath}${region.regionCode}/App-Data`,
                    projectRegionAreas: collection.projectRegionAreas.map((area) => ({
                        areaId: area.areaId,
                        intervalType: area.intervalType,
                        intervalValue: area.intervalValue,
                        areaName: area.areaName,
                    })),
                }))),
            }))),
            projectName: originalData.projectName,
            projectId: originalData.projectId,
            projectNumber: originalData.projectNumber,
        };
    }
    extractRegionAndAreaInfoCount(originalData) {
        return {
            regionCount: originalData.projectRegions.length,
            areaCount: originalData.projectRegions.reduce((count, region) => {
                return (count +
                    region.projectRegionCollectionKmls.reduce((innerCount, collection) => {
                        return innerCount + collection.projectRegionAreas.length;
                    }, 0));
            }, 0),
        };
    }
    async updateBoundingBoxForAllProjects() {
        const projects = await this.projectRepo.getAllProjects();
        for (const project of projects) {
            if (!project.shapeFileUrl) {
                this.loggerService.warn(`Project ${project.projectNumber} has no KML/GeoJSON URL.`);
                continue;
            }
            try {
                const response = await fetch(project.shapeFileUrl);
                if (!response.ok) {
                    this.loggerService.warn(`Failed to fetch file for project ${project.projectNumber}. Status: ${response.status}`);
                    continue;
                }
                const fileData = await response.text();
                if (!fileData) {
                    this.loggerService.warn(`Empty file fetched for project ${project.projectNumber}`);
                    continue;
                }
                const { boundingBox } = await (0, fileUpload_common_1.convertKmlToGeoJson)(fileData);
                if (!boundingBox) {
                    this.loggerService.warn(`Bounding box not generated for project ${project.projectNumber}`);
                    continue;
                }
                await this.projectRepo.updateById(project.projectId, {
                    boundingBox,
                });
                this.loggerService.log(`Bounding box updated for project ${project.projectNumber}`);
            }
            catch (err) {
                this.loggerService.error(`Error processing project ${project.projectNumber}:`, err);
            }
        }
        return { message: "Bounding box update completed" };
    }
    async updateWorkstations(projectId, data) {
        return await this.projectRepo.updateById(projectId, data);
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [project_repo_1.ProjectRepo,
        aws_s3_service_1.AWSS3Service,
        config_1.ConfigService,
        adm_project_user_role_service_1.AdmProjectUserRoleService,
        axios_1.HttpService,
        logger_service_1.LoggerService])
], ProjectService);
//# sourceMappingURL=project.service.js.map