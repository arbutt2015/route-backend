import { Injectable } from "@nestjs/common";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";

@Injectable()
export class AdmProjectUserRoleRepo {
  private projectUserRoleRepository: any;
  constructor(private geneRepoService: GeneRepoService) {
    (async () => {
      this.projectUserRoleRepository =
        await this.geneRepoService.getRepository("AdmProjectUserRole");
    })();
  }
  async createProjectUserRole(createProjectUserRoleDto: {
    projectId: number;
    userId: number;
  }) {
    return await this.geneRepoService.create(this.projectUserRoleRepository, {
      projectId: createProjectUserRoleDto.projectId,
      userId: createProjectUserRoleDto.userId,
    });
  }
  async getAllProjectUsersRoles(filter?: any, options?: any) {
    return await this.geneRepoService.getAll(
      this.projectUserRoleRepository,
      filter,
      options,
    );
  }
  async getAllProjectUsersRole(filter: any, options: any) {
    return await this.geneRepoService.getAll(
      this.projectUserRoleRepository,
      filter,
      options,
    );
  }

  async deleteProjectUserRole(projectId: number, userId: number) {
    await this.projectUserRoleRepository.delete({ projectId, userId });
  }
}
