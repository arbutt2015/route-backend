import { Injectable } from "@nestjs/common";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";

@Injectable()
export class AdmModuleRepo {
  private admModuleRepository: any;
  constructor(private geneRepoService: GeneRepoService) {
    (async () => {
      this.admModuleRepository =
        await this.geneRepoService.getRepository("AdmModule");
    })();
  }

  async getAllModules(filter?: any, options?: any) {
    return await this.geneRepoService.getAll(
      this.admModuleRepository,
      filter,
      options,
    );
  }
  async createORUpdateModule(createModuleDto: any) {
    return await this.geneRepoService.create(
      this.admModuleRepository,
      createModuleDto,
    );
  }
}
