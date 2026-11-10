import { Injectable } from "@nestjs/common";
import { AdmFeatureRepo } from "./adm-feature.repo";

@Injectable()
export class AdmFeatureService {
  constructor(private readonly admFeatureRepo: AdmFeatureRepo) {}
  async getAllFeaturesByModuleId(moduleId: string) {
    return await this.admFeatureRepo.getAllFeaturesByModuleId({
      where: {
        module: {
          moduleId: moduleId,
        },
      },
    });
  }

  async getAllFeatures(filter?: any, options?: any) {
    return await this.admFeatureRepo.getAllFeatures(filter, options);
  }
  async createORUpdateFeature(dataObject: any) {
    return await this.admFeatureRepo.createORUpdateFeature(dataObject);
  }
}
