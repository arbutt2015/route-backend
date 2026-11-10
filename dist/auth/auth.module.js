"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const aws_cognito_service_1 = require("../aws/aws-cognito.service");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const gene_repo_service_1 = require("../gene-repo/gene-repo.service");
const adm_module_module_1 = require("../adm-module/adm-module.module");
const adm_user_module_1 = require("../adm-user/adm-user.module");
const jwt_strategy_1 = require("./jwt-strategy");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const adm_project_user_role_module_1 = require("../adm-project-user-role/adm-project-user-role.module");
const aws_ses_service_1 = require("../aws/aws-ses.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            adm_module_module_1.AdmModuleModule,
            adm_user_module_1.AdmUserModule,
            adm_project_user_role_module_1.ProjectUserRoleModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get("AWS_COGNITO_CLIENT_SECRET"),
                    signOptions: { expiresIn: "60m" },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            auth_service_1.AuthService,
            aws_cognito_service_1.AWSCognitoService,
            gene_repo_service_1.GeneRepoService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            aws_ses_service_1.AWSSESService,
        ],
        exports: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map