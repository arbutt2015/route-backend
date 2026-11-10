import { Module } from "@nestjs/common";
import { AdmRoleController } from "./adm-role.controller";
import { AdmRoleService } from "./adm-role.service";
import { AdmRoleRepo } from "./adm-role.repo";
import { AdmRoleFeatureModule } from "src/adm-role-feature/adm-role-feature.module";
import { AdmFeatureModule } from "src/adm-feature/adm-feature.module";
import { AdmModuleModule } from "src/adm-module/adm-module.module";
import { LoggingService } from "src/common/graylog.common";

@Module({
  imports: [AdmRoleFeatureModule, AdmFeatureModule, AdmModuleModule],
  controllers: [AdmRoleController],
  providers: [AdmRoleService, AdmRoleRepo, LoggingService],
  exports: [AdmRoleService],
})
export class AdmRoleModule {}
