import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProjectModule } from "src/project/project.module";
import { AuthCollectorService } from "./auth-collector.service";
import { CustomAuthGuard } from "./jwt-auth-collector.guard";
import { AuthCollectorController } from "./auth-collector.controller";
import { CustomJwtStrategy } from "./jwt-strategy-collector";
import { AWSS3Service } from "src/aws/aws-s3.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("AWS_COGNITO_CLIENT_SECRET"),
        signOptions: { expiresIn: "60m" },
      }),
      inject: [ConfigService],
    }),
    ProjectModule,
  ],
  controllers: [AuthCollectorController],
  providers: [
    AuthCollectorService,
    CustomAuthGuard,
    CustomJwtStrategy,
    AWSS3Service,
  ],
  exports: [AuthCollectorService, CustomAuthGuard, CustomJwtStrategy],
})
export class AuthCollectorModule {}
