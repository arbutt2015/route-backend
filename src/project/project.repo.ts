import { Injectable } from "@nestjs/common";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";

@Injectable()
export class ProjectRepo {
  private projectRepository: any;
  constructor(private geneRepoService: GeneRepoService) {
    (async () => {
      this.projectRepository =
        await this.geneRepoService.getRepository("Project");
    })();
  }

  async getAllProjects(filter?: any, options?: any) {
    return await this.geneRepoService.getAll(
      this.projectRepository,
      filter,
      options,
    );
  }

  async getOneProjects(filter?: any, options?: any) {
    return await this.geneRepoService.getOne(
      this.projectRepository,
      filter,
      options,
    );
  }

  async getAllProjectsForCollector(projectId: number, userId: number) {
    return await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.projectRegions", "projectRegion")
      .leftJoinAndSelect(
        "projectRegion.projectRegionCollectionKmls",
        "projectRegionCollectionKmls",
      )
      .leftJoinAndSelect(
        "projectRegionCollectionKmls.projectRegionAreas",
        "projectRegionArea",
      ) // Use the correct alias
      .leftJoinAndSelect("projectRegionArea.collector", "collector") // Change to projectRegionArea
      .where("project.projectId = :projectId", { projectId })
      .andWhere("collector.userId = :userId", { userId }) // Check if userId exists in projectRegionArea
      .getOne();
  }
  async getProjectById(projectId: number) {
    const repository = this.projectRepository;
    const response: any = await this.geneRepoService.getOne(
      repository,
      { where: { projectId } },
      {
        relations: [
          "regions",
          "client",
          "agency",
          "projectUsers",
          "projectUsers.user",
        ],
      },
    );

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
        ...response.regions.map((region: any) => ({
          id: region?.regionId,
          name: region?.regionName,
        })),
      ],
    };

    return projectData;
  }
  async checkProjectNumberExists(projectNumber: string) {
    return this.projectRepository
      .createQueryBuilder("project")
      .select(["project.projectNumber"])
      .where("LOWER(project.projectNumber) = LOWER(:projectNumber)", {
        projectNumber: projectNumber,
      })
      .getOne();
  }
  async updateDownloadStatus(projectId: number) {
    return this.geneRepoService.updateById(this.projectRepository, projectId, {
      isExportable: false,
      projectDataExportUrl: null,
    });
  }
  async updateIsActiveStatus(projectId: number, isActive: boolean) {
    return this.geneRepoService.updateById(this.projectRepository, projectId, {
      isActive,
    });
  }
  async checkProjectNameExists(projectName: string) {
    return this.projectRepository
      .createQueryBuilder("project")
      .select(["project.projectName"])
      .where("LOWER(project.projectName) = LOWER(:projectName)", {
        projectName,
      })
      .getOne();
  }

  async getDefaultProjectTypeId(filter?: any, options?: any) {
    const repository = this.projectRepository;
    return this.geneRepoService.getOne(repository, filter, options);
  }
  async createProject(project: any) {
    return await this.geneRepoService.create(this.projectRepository, project);
  }
  async updateById(id: number, data: any) {
    const repository = this.projectRepository;
    return this.geneRepoService.updateById(repository, id, data);
  }
}
