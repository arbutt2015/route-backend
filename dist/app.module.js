"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const configurations_service_1 = require("./configurations/configurations.service");
const configurations_module_1 = require("./configurations/configurations.module");
const config_1 = require("@nestjs/config");
const logger_middleware_common_1 = require("./common/logger.middleware.common");
const auth_module_1 = require("./auth/auth.module");
const adm_user_module_1 = require("./adm-user/adm-user.module");
const adm_role_module_1 = require("./adm-role/adm-role.module");
const adm_role_feature_module_1 = require("./adm-role-feature/adm-role-feature.module");
const adm_feature_module_1 = require("./adm-feature/adm-feature.module");
const adm_module_module_1 = require("./adm-module/adm-module.module");
const project_module_1 = require("./project/project.module");
const adm_project_user_role_module_1 = require("./adm-project-user-role/adm-project-user-role.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const role_guard_1 = require("./auth/role.guard");
const gene_repo_module_1 = require("./gene-repo/gene-repo.module");
const response_helper_module_1 = require("./response-helper/response-helper.module");
const logger_module_1 = require("./logger/logger.module");
const logger_service_1 = require("./logger/logger.service");
const response_interceptor_1 = require("./interceptors/response.interceptor");
const project_service_1 = require("./project/project.service");
const adm_role_service_1 = require("./adm-role/adm-role.service");
const path = require("path");
const serve_static_1 = require("@nestjs/serve-static");
let AppModule = class AppModule {
    constructor(logger, configService, admRoleService, projectService) {
        this.logger = logger;
        this.configService = configService;
        this.admRoleService = admRoleService;
        this.projectService = projectService;
    }
    configure(consumer) {
        consumer
            .apply(logger_middleware_common_1.LoggerMiddleware)
            .forRoutes({ path: "*", method: common_1.RequestMethod.ALL });
    }
    async onModuleInit() {
        const host = this.configService.get("SERVER_HOST") || "localhost";
        const port = this.configService.get("SERVER_PORT") || 5001;
        const role = await this.admRoleService.getAllRoles({
            where: { roleCode: "UR-1" },
        });
        const roleViewer = await this.admRoleService.getAllRoles({
            where: { roleCode: "UR-4" },
        });
        const project = await this.projectService.getAllProjects({
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
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: role_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
            logger_middleware_common_1.LoggerMiddleware,
        ],
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path.join(__dirname, "..", "temp-data-file"),
                serveRoot: "/uploads",
            }, {
                rootPath: path.join(__dirname, "..", "static-data"),
                serveRoot: "/static",
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: process.env.NODE_ENV === "development"
                    ? ".env.development"
                    : ".env.production",
                load: [
                    async () => await new configurations_service_1.ConfigurationsService(new config_1.ConfigService()).loadConfigurations(),
                ],
                cache: false,
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [configurations_module_1.ConfigurationsModule],
                name: "read_and_write",
                useFactory: async () => {
                    const configService = new config_1.ConfigService();
                    return {
                        type: "mssql",
                        host: configService.get("SQL_HOST"),
                        port: Number(configService.get("SQL_PORT")),
                        username: configService.get("SQL_USER"),
                        password: configService.get("SQL_PASSWORD"),
                        database: configService.get("SQL_DATABASE"),
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
                inject: [configurations_service_1.ConfigurationsService],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [configurations_module_1.ConfigurationsModule],
                name: "read_only",
                useFactory: async () => {
                    const configService = new config_1.ConfigService();
                    return {
                        type: "mssql",
                        host: configService.get("SQL_HOST"),
                        port: Number(configService.get("SQL_PORT")),
                        username: configService.get("SQL_USER"),
                        password: configService.get("SQL_PASSWORD"),
                        database: configService.get("SQL_DATABASE"),
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
                inject: [configurations_service_1.ConfigurationsService],
            }),
            response_helper_module_1.ResponseHelperModule,
            logger_module_1.LoggerModule,
            configurations_module_1.ConfigurationsModule,
            auth_module_1.AuthModule,
            adm_user_module_1.AdmUserModule,
            adm_role_module_1.AdmRoleModule,
            adm_role_feature_module_1.AdmRoleFeatureModule,
            adm_feature_module_1.AdmFeatureModule,
            adm_module_module_1.AdmModuleModule,
            adm_project_user_role_module_1.ProjectUserRoleModule,
            project_module_1.ProjectModule,
            gene_repo_module_1.GeneRepoModule,
        ],
    }),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService,
        adm_role_service_1.AdmRoleService,
        project_service_1.ProjectService])
], AppModule);
//# sourceMappingURL=app.module.js.map