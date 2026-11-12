import { Module } from "@nestjs/common";
import { CollectorController } from "./collector.controller";
import { CollectorService } from "./collector.service";
import { AuthCollectorModule } from "src/collector-auth/auth-collector.module";
import { ProjectModule } from "src/project/project.module";
import { AWSS3Service } from "src/aws/aws-s3.service";

@Module({
  imports: [AuthCollectorModule, ProjectModule],
  controllers: [CollectorController],
  providers: [CollectorService, AWSS3Service],
})
export class CollectorModule {}
