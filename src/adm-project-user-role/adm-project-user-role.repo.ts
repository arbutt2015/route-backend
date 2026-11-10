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
  async createProjectUserRole(createProjectUserRoleDto: any) {
    return await this.geneRepoService.create(
      this.projectUserRoleRepository,
      createProjectUserRoleDto,
    );
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

  async deleteProjectUserRole(projectUserRoleId: number) {
    await this.geneRepoService.deleteById(
      this.projectUserRoleRepository,
      projectUserRoleId,
    );
  }
}
