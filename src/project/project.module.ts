import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectRepo } from "./project.repo";
import { AWSS3Service } from "src/aws/aws-s3.service";
import { HttpModule } from "@nestjs/axios";
import { AdmUserModule } from "src/adm-user/adm-user.module";
import { ProjectUserRoleModule } from "src/adm-project-user-role/adm-project-user-role.module";

@Module({
  imports: [HttpModule, AdmUserModule, ProjectUserRoleModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepo, AWSS3Service],
  exports: [ProjectService],
})
export class ProjectModule {}
