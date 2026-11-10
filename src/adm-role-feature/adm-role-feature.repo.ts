import { Injectable } from "@nestjs/common";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";
import { FeatureDto } from "./dto/create-feature.dto";

@Injectable()
export class AdmRoleFeatureRepo {
  private admRoleFeatureRepository: any;
  constructor(private geneRepoService: GeneRepoService) {
    (async () => {
      this.admRoleFeatureRepository =
        await this.geneRepoService.getRepository("AdmRoleFeature");
    })();
  }

  async createRoleFeature(createRoleWithFeaturesDto: FeatureDto) {
    return await this.geneRepoService.create(
      this.admRoleFeatureRepository,
      createRoleWithFeaturesDto,
    );
  }
  async getAllRolesFeatures() {
    return await this.geneRepoService.getAll(this.admRoleFeatureRepository);
  }
  async getRolesAndFeaturesByIds(filter?: any, option?: any) {
    return await this.geneRepoService.getOne(
      this.admRoleFeatureRepository,
      filter,
      option,
    );
  }
  async getRolesFeaturesByRoleId(filter?: any, option?: any) {
    return await this.geneRepoService.getAll(
      this.admRoleFeatureRepository,
      filter,
      option,
    );
  }
}
