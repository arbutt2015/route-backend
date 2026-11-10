import { Module } from "@nestjs/common";
import { AdmRoleFeatureController } from "./adm-role-feature.controller";
import { AdmRoleFeatureService } from "./adm-role-feature.service";
import { AdmRoleFeatureRepo } from "./adm-role-feature.repo";
import { ProjectModule } from "src/project/project.module";
import { AWSS3Service } from "src/aws/aws-s3.service";
import { AdmUserModule } from "src/adm-user/adm-user.module";
import { ProjectUserRoleModule } from "src/adm-project-user-role/adm-project-user-role.module";

@Module({
  imports: [ProjectModule, AdmUserModule, ProjectUserRoleModule],
  controllers: [AdmRoleFeatureController],
  providers: [AdmRoleFeatureService, AdmRoleFeatureRepo, AWSS3Service],
  exports: [AdmRoleFeatureService],
})
export class AdmRoleFeatureModule {}
