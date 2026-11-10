import { Injectable } from "@nestjs/common";
import { AdmRoleRepo } from "./adm-role.repo";
import { AdmRoleFeatureService } from "../adm-role-feature/adm-role-feature.service";
import { AdmModuleService } from "../adm-module/adm-module.service";
import { AdmFeatureService } from "src/adm-feature/adm-feature.service";
import { CreateRoleDto } from "./dto/create-update.dto";

@Injectable()
export class AdmRoleService {
  constructor(
    private admRoleRepo: AdmRoleRepo,
    private admRoleFeatureService: AdmRoleFeatureService,
    private admModuleService: AdmModuleService,
    private admFeatureService: AdmFeatureService,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    return await this.admRoleRepo.createRole(createRoleDto);
  }

  async getAllRoles(filter?: any, options?: any) {
    return await this.admRoleRepo.getAllRoles(filter, options);
  }
  async getRolesById(roleId: string) {
    let allFeatures: any = null;
    const moduleWithFeature = [];
    const allModules = await this.admModuleService.getAllModules({
      where: {
        moduleName: "Project", // enabled role only for project if you want enabled role for other module then change here or remove where conation
      },
    });
    await Promise.all(
      allModules.map(async (module) => {
        allFeatures = await this.admFeatureService.getAllFeaturesByModuleId(
          module.moduleId,
        );
        const roleWithFeature: any = [];

        await Promise.all(
          allFeatures.map(async (feature) => {
            const roleWithFeatureTemp =
              await this.admRoleFeatureService.getRolesAndFeaturesByIds(
                roleId,
                feature.featureId,
              );
            if (roleWithFeatureTemp) {
              roleWithFeature.push({
                featureId: roleWithFeatureTemp.featureId,
                featureName: feature.featureName,
                createPermission: roleWithFeatureTemp.createPermission,
                readPermissions: roleWithFeatureTemp.readPermissions,
                updatePermission: roleWithFeatureTemp.updatePermission,
                deletePermissions: roleWithFeatureTemp.deletePermissions,
              });
            } else {
              roleWithFeature.push({
                featureId: feature.featureId,
                featureName: feature.featureName,
                createPermission: false,
                readPermissions: false,
                updatePermission: false,
                deletePermissions: false,
              });
            }
          }),
        );

        moduleWithFeature.push({
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          features: roleWithFeature,
        });
      }),
    );

    return moduleWithFeature;
  }

  async deleteRole(roleId: number) {
    return await this.admRoleRepo.deleteRole({ roleId });
  }
}
