import { Injectable } from "@nestjs/common";
import { AdmModuleRepo } from "./adm-module.repo";

@Injectable()
export class AdmModuleService {
  constructor(private moduleRepo: AdmModuleRepo) {}
  async getAllModules(filter?: any, options?: any) {
    return await this.moduleRepo.getAllModules(filter, options);
  }

  async createORUpdateModule(createModuleDto: any) {
    return await this.moduleRepo.createORUpdateModule(createModuleDto);
  }
}
