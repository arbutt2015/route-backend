import { Injectable } from "@nestjs/common";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";

@Injectable()
export class AdmRoleRepo {
  private admRoleRepository: any;
  constructor(private geneRepoService: GeneRepoService) {
    (async () => {
      this.admRoleRepository =
        await this.geneRepoService.getRepository("AdmRole");
    })();
  }

  async createRole(roleData: any) {
    const role = await this.geneRepoService.create(
      this.admRoleRepository,
      roleData,
    );
    return role;
  }
  async getAllRoles(filter?: any, options?: any) {
    return await this.geneRepoService.getAll(
      this.admRoleRepository,
      filter,
      options,
    );
  }
  async deleteRole(filter?: any) {
    return await this.geneRepoService.deleteOne(this.admRoleRepository, filter);
  }
}
