import { Module, Global } from "@nestjs/common";
import { ConfigurationsService } from "./configurations.service";
import { LoggingService } from "src/common/graylog.common";
@Global()
@Module({
  providers: [ConfigurationsService, LoggingService],
  exports: [ConfigurationsService], // export the config service to be used in other modules
})
@Module({})
export class ConfigurationsModule {}
