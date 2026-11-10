import { Module } from "@nestjs/common";
import { AdmModuleController } from "./adm-module.controller";
import { AdmModuleService } from "./adm-module.service";
import { AdmModuleRepo } from "./adm-module.repo";
import { LoggingService } from "src/common/graylog.common";

@Module({
  controllers: [AdmModuleController],
  providers: [AdmModuleService, AdmModuleRepo, LoggingService],
  exports: [AdmModuleService],
})
export class AdmModuleModule {}
