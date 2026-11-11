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

  async checkProjectNameExists(projectName: string) {
    return this.projectRepository
      .createQueryBuilder("project")
      .select(["project.projectName"])
      .where("LOWER(project.projectName) = LOWER(:projectName)", {
        projectName,
      })
      .getOne();
  }

  async updateIsActiveStatus(projectId: number, isActive: boolean) {
    return this.geneRepoService.updateById(this.projectRepository, projectId, {
      isActive,
    });
  }

  async createProject(project: any) {
    return await this.geneRepoService.create(this.projectRepository, project);
  }
  async updateById(id: number, data: any) {
    const repository = this.projectRepository;
    return this.geneRepoService.updateById(repository, id, data);
  }
}
