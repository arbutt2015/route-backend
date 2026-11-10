"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmUserModule = void 0;
const common_1 = require("@nestjs/common");
const adm_user_controller_1 = require("./adm-user.controller");
const adm_user_service_1 = require("./adm-user.service");
const adm_user_repo_1 = require("./adm-user.repo");
const graylog_common_1 = require("../common/graylog.common");
const aws_cognito_service_1 = require("../aws/aws-cognito.service");
let AdmUserModule = class AdmUserModule {
};
exports.AdmUserModule = AdmUserModule;
exports.AdmUserModule = AdmUserModule = __decorate([
    (0, common_1.Module)({
        controllers: [adm_user_controller_1.AdmUserController],
        providers: [adm_user_service_1.AdmUserService, adm_user_repo_1.AdmUserRepo, graylog_common_1.LoggingService, aws_cognito_service_1.AWSCognitoService],
        exports: [adm_user_service_1.AdmUserService],
    })
], AdmUserModule);
//# sourceMappingURL=adm-user.module.js.map