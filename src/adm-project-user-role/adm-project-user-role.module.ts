import { Module } from "@nestjs/common";
import { AdmProjectUserRoleController } from "./adm-project-user-role.controller";
import { AdmProjectUserRoleService } from "./adm-project-user-role.service";
import { AdmProjectUserRoleRepo } from "./adm-project-user-role.repo";

@Module({
  controllers: [AdmProjectUserRoleController],
  providers: [AdmProjectUserRoleService, AdmProjectUserRoleRepo],
  exports: [AdmProjectUserRoleService],
})
export class ProjectUserRoleModule {}
