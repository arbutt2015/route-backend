import { Module } from "@nestjs/common";
import { AdmFeatureController } from "./adm-feature.controller";
import { AdmFeatureService } from "./adm-feature.service";
import { AdmFeatureRepo } from "./adm-feature.repo";
import { LoggingService } from "src/common/graylog.common";

@Module({
  controllers: [AdmFeatureController],
  providers: [AdmFeatureService, AdmFeatureRepo, LoggingService],
  exports: [AdmFeatureService],
})
export class AdmFeatureModule {}
