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
exports.ProjectRepo = void 0;
const common_1 = require("@nestjs/common");
const gene_repo_service_1 = require("../gene-repo/gene-repo.service");
let ProjectRepo = class ProjectRepo {
    constructor(geneRepoService) {
        this.geneRepoService = geneRepoService;
        (async () => {
            this.projectRepository =
                await this.geneRepoService.getRepository("Project");
        })();
    }
    async getAllProjects(filter, options) {
        return await this.geneRepoService.getAll(this.projectRepository, filter, options);
    }
    async getOneProjects(filter, options) {
        return await this.geneRepoService.getOne(this.projectRepository, filter, options);
    }
    async getAllProjectsForCollector(projectId, userId) {
        return await this.projectRepository
            .createQueryBuilder("project")
            .leftJoinAndSelect("project.projectRegions", "projectRegion")
            .leftJoinAndSelect("projectRegion.projectRegionCollectionKmls", "projectRegionCollectionKmls")
            .leftJoinAndSelect("projectRegionCollectionKmls.projectRegionAreas", "projectRegionArea")
            .leftJoinAndSelect("projectRegionArea.collector", "collector")
            .where("project.projectId = :projectId", { projectId })
            .andWhere("collector.userId = :userId", { userId })
            .getOne();
    }
    async getProjectById(projectId) {
        const repository = this.projectRepository;
        const response = await this.geneRepoService.getOne(repository, { where: { projectId } }, {
            relations: [
                "regions",
                "client",
                "agency",
                "projectUsers",
                "projectUsers.user",
            ],
        });
        if (!response) {
            return null;
        }
        const projectData = {
            projectId: response.projectId,
            projectName: response.projectName,
            projectS3BucketFolderPath: response?.projectS3BucketFolderPath,
            client: {
                id: response.client?.clientId,
                name: response.client?.clientName,
            },
            agency: {
                id: response.agency?.agencyId,
                name: response.agency?.agencyName,
            },
            clientPOC: {
                userId: response.projectUsers[0]?.userId,
                email: response.projectUsers[0]?.user?.email,
            },
            regions: [
                ...response.regions.map((region) => ({
                    id: region?.regionId,
                    name: region?.regionName,
                })),
            ],
        };
        return projectData;
    }
    async checkProjectNumberExists(projectNumber) {
        return this.projectRepository
            .createQueryBuilder("project")
            .select(["project.projectNumber"])
            .where("LOWER(project.projectNumber) = LOWER(:projectNumber)", {
            projectNumber: projectNumber,
        })
            .getOne();
    }
    async updateDownloadStatus(projectId) {
        return this.geneRepoService.updateById(this.projectRepository, projectId, {
            isExportable: false,
            projectDataExportUrl: null,
        });
    }
    async updateIsActiveStatus(projectId, isActive) {
        return this.geneRepoService.updateById(this.projectRepository, projectId, {
            isActive,
        });
    }
    async checkProjectNameExists(projectName) {
        return this.projectRepository
            .createQueryBuilder("project")
            .select(["project.projectName"])
            .where("LOWER(project.projectName) = LOWER(:projectName)", {
            projectName,
        })
            .getOne();
    }
    async getDefaultProjectTypeId(filter, options) {
        const repository = this.projectRepository;
        return this.geneRepoService.getOne(repository, filter, options);
    }
    async createProject(project) {
        return await this.geneRepoService.create(this.projectRepository, project);
    }
    async updateById(id, data) {
        const repository = this.projectRepository;
        return this.geneRepoService.updateById(repository, id, data);
    }
};
exports.ProjectRepo = ProjectRepo;
exports.ProjectRepo = ProjectRepo = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gene_repo_service_1.GeneRepoService])
], ProjectRepo);
//# sourceMappingURL=project.repo.js.map