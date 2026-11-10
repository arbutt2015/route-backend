import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AWSCognitoService } from "../aws/aws-cognito.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";
import { AdmModuleModule } from "src/adm-module/adm-module.module";
import { AdmUserModule } from "src/adm-user/adm-user.module";
import { JwtStrategy } from "./jwt-strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ProjectUserRoleModule } from "src/adm-project-user-role/adm-project-user-role.module";
import { AWSSESService } from "src/aws/aws-ses.service";

@Module({
  imports: [
    AdmModuleModule,
    AdmUserModule,
    ProjectUserRoleModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("AWS_COGNITO_CLIENT_SECRET"),
        signOptions: { expiresIn: "60m" },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AWSCognitoService,
    GeneRepoService,
    JwtStrategy,
    JwtAuthGuard,
    AWSSESService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
