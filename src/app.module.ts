import "reflect-metadata";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigurationsService } from "./configurations/configurations.service";
import { ConfigurationsModule } from "./configurations/configurations.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerMiddleware } from "./common/logger.middleware.common";
import { AuthModule } from "./auth/auth.module";
import { AdmUserModule } from "./adm-user/adm-user.module";
import { AdmRoleModule } from "./adm-role/adm-role.module";
import { AdmRoleFeatureModule } from "./adm-role-feature/adm-role-feature.module";
import { AdmFeatureModule } from "./adm-feature/adm-feature.module";
import { AdmModuleModule } from "./adm-module/adm-module.module";
import { ProjectModule } from "./project/project.module";
import { ProjectUserRoleModule } from "./adm-project-user-role/adm-project-user-role.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { RolesGuard } from "./auth/role.guard";
import { GeneRepoModule } from "./gene-repo/gene-repo.module";
import { ResponseHelperModule } from "./response-helper/response-helper.module";
import { LoggerModule } from "./logger/logger.module";
import { LoggerService } from "./logger/logger.service";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { ProjectService } from "./project/project.service";
import { AdmRoleService } from "./adm-role/adm-role.service";
import * as path from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    LoggerMiddleware,
  ],
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: path.join(__dirname, "..", "temp-data-file"),
        serveRoot: "/uploads",
      },
      {
        rootPath: path.join(__dirname, "..", "static-data"),
        serveRoot: "/static",
      },
    ),
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === "development"
          ? ".env.development"
          : ".env.production",
      load: [
        async () =>
          await new ConfigurationsService(
            new ConfigService(),
          ).loadConfigurations(),
      ],
      cache: false,
      isGlobal: true, // make configuration global
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationsModule],
      name: "read_and_write",
      useFactory: async (): Promise<any> => {
        const configService = new ConfigService();
        return {
          type: "mssql",
          host: configService.get<string>("SQL_HOST"),
          port: Number(configService.get<string>("SQL_PORT")),
          username: configService.get<string>("SQL_USER"),
          password: configService.get<string>("SQL_PASSWORD"),
          database: configService.get<string>("SQL_DATABASE"),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          options: {
            requestTimeout: 180000, // 60 seconds (default is 15000ms or 15s)
          },
          synchronize: false,
          extra: {
            trustServerCertificate: true,
            max: 10,
            min: 2,
          },
        };
      },
      inject: [ConfigurationsService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationsModule],
      name: "read_only",
      useFactory: async (): Promise<any> => {
        const configService = new ConfigService();
        return {
          type: "mssql",
          host: configService.get<string>("SQL_HOST_READ_ONLY"),
          port: Number(configService.get<string>("SQL_PORT_READ_ONLY")),
          username: configService.get<string>("SQL_USER_READ_ONLY"),
          password: configService.get<string>("SQL_PASSWORD_READ_ONLY"),
          database: configService.get<string>("SQL_DATABASE_READ_ONLY"),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          options: {
            requestTimeout: 180000,
          },
          synchronize: false,
          extra: {
            trustServerCertificate: true,
            max: 10,
            min: 2,
          },
        };
      },
      inject: [ConfigurationsService],
    }),
    ResponseHelperModule,
    LoggerModule,
    ConfigurationsModule,
    AuthModule,
    AdmUserModule,
    AdmRoleModule,
    AdmRoleFeatureModule,
    AdmFeatureModule,
    AdmModuleModule,
    ProjectUserRoleModule,
    ProjectModule,
    GeneRepoModule,
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(
    private logger: LoggerService,
    private configService: ConfigService,
    private admRoleService: AdmRoleService,
    private projectService: ProjectService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
  async onModuleInit() {
    const host = this.configService.get<string>("SERVER_HOST") || "localhost";
    const port = this.configService.get<number>("SERVER_PORT") || 5001;
    const role: any = await this.admRoleService.getAllRoles({
      where: { roleCode: "UR-1" },
    });
    const roleViewer: any = await this.admRoleService.getAllRoles({
      where: { roleCode: "UR-4" },
    });
    const project: any = await this.projectService.getAllProjects({
      where: { projectNumber: "T00000" },
    });
    this.configService.set("DEFAULT_ROLE_ID", 0);
    this.configService.set("VIEWER_DEFAULT_ROLE_ID", 0);
    this.configService.set("DEMO_PROJECT_ID", 0);
    if (role.length > 0) {
      this.configService.set("DEFAULT_ROLE_ID", role[0]?.roleId);
    }
    if (roleViewer.length > 0) {
      this.configService.set("VIEWER_DEFAULT_ROLE_ID", roleViewer[0]?.roleId);
    }
    if (project.length > 0) {
      this.configService.set("DEMO_PROJECT_ID", project[0]?.projectId);
    }
    this.logger.log(`server start.....http//:${host}:${port}`);
  }
}
