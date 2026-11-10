import { Module } from "@nestjs/common";
import { AdmUserController } from "./adm-user.controller";
import { AdmUserService } from "./adm-user.service";
import { AdmUserRepo } from "./adm-user.repo";
import { LoggingService } from "src/common/graylog.common";
import { AWSCognitoService } from "src/aws/aws-cognito.service";

@Module({
  controllers: [AdmUserController],
  providers: [AdmUserService, AdmUserRepo, LoggingService, AWSCognitoService], // Provide UserRepo here
  exports: [AdmUserService], // Export UserService for other modules to use
})
export class AdmUserModule {}
