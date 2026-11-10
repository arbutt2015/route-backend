import { Injectable } from "@nestjs/common";
import { AdmRoleFeatureRepo } from "./adm-role-feature.repo";
import { FeatureDto } from "./dto/create-feature.dto";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { AdmProjectUserRoleService } from "src/adm-project-user-role/adm-project-user-role.service";

@Injectable()
export class AdmRoleFeatureService {
  constructor(
    private readonly admRoleFeatureRepository: AdmRoleFeatureRepo,
    private admUserService: AdmUserService,
    private admProjectUserRoleService: AdmProjectUserRoleService,
  ) {}

  async createRoleFeature(createRoleWithFeaturesDto: FeatureDto) {
    return await this.admRoleFeatureRepository.createRoleFeature(
      createRoleWithFeaturesDto,
    );
  }
  async getAllRolesFeatures() {
    return await this.admRoleFeatureRepository.getAllRolesFeatures();
  }

  async getRolesAndFeaturesByIds(
    roleId: string,
    featureId?: string,
    options?: any,
  ) {
    return await this.admRoleFeatureRepository.getRolesAndFeaturesByIds(
      {
        where: { roleId, featureId },
      },
      options,
    );
  }

  async getRolesFeaturesByRoleIdByProjectId(projectId: number, userId: any) {
    const results = await this.admProjectUserRoleService.getProjectByUserId(
      userId,
      projectId,
    );
    const filteredResults: any = results.map((projectUserRole) => ({
      projectUserRoleId: projectUserRole.projectUserRoleId,
      roleId: projectUserRole.role.roleId,
      project: {
        projectId: projectUserRole.project.projectId,
        projectName: projectUserRole.project.projectName,
        agencyName: projectUserRole.project.agencyName,
        projectNumber: projectUserRole.project.projectNumber,
        projectKmlGeoJson: projectUserRole.project.projectKmlGeoJson,
        projectS3BucketFolderPath:
          projectUserRole.project.projectS3BucketFolderPath,
        geoJsonS3FilePath: projectUserRole.project.geoJsonS3FilePath,
        projectDataExportUrl: projectUserRole.project.projectDataExportUrl,
        isExportable: projectUserRole.project.isExportable,
        boundingBox: projectUserRole.project.boundingBox?.split(","),
        projectRegions: projectUserRole.project.projectRegions.map(
          (region) => ({
            regionId: region.regionId,
            regionName: region.regionName,
            regionCode: region.regionCode,
            regionBaseShapeFilePath: region.regionBaseShapeFilePath,
            regionKmlGeoJson: region.regionKmlGeoJson,
            lockRegion: region.lockRegion,
            projectRegionCollectionKml: region.projectRegionCollectionKmls.map(
              (collection) => ({
                ...collection,
              }),
            ),
          }),
        ),
      },
    }));
    const roleFeature =
      await this.admRoleFeatureRepository.getRolesFeaturesByRoleId(
        {
          where: { roleId: filteredResults[0]?.roleId },
        },
        {
          relations: ["feature"],
        },
      );
    return { roleFeature, projectWithRegion: filteredResults[0] };
  }
}
