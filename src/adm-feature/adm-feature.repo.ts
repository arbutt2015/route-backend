import { Injectable } from "@nestjs/common";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";

@Injectable()
export class AdmFeatureRepo {
  private projectUserRepository: any;
  constructor(private geneRepoService: GeneRepoService) {
    (async () => {
      this.projectUserRepository =
        await this.geneRepoService.getRepository("AdmFeature");
    })();
  }
  async getAllFeaturesByModuleId(filter?: any, option?: any) {
    return await this.geneRepoService.getAll(
      this.projectUserRepository,
      filter,
      option,
    );
  }
  async getAllFeatures(filter?: any, option?: any) {
    return await this.geneRepoService.getAll(
      this.projectUserRepository,
      filter,
      option,
    );
  }

  async createORUpdateFeature(feature: any) {
    return await this.geneRepoService.create(
      this.projectUserRepository,
      feature,
    );
  }
}
