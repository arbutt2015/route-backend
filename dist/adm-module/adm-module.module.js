"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmModuleModule = void 0;
const common_1 = require("@nestjs/common");
const adm_module_controller_1 = require("./adm-module.controller");
const adm_module_service_1 = require("./adm-module.service");
const adm_module_repo_1 = require("./adm-module.repo");
const graylog_common_1 = require("../common/graylog.common");
let AdmModuleModule = class AdmModuleModule {
};
exports.AdmModuleModule = AdmModuleModule;
exports.AdmModuleModule = AdmModuleModule = __decorate([
    (0, common_1.Module)({
        controllers: [adm_module_controller_1.AdmModuleController],
        providers: [adm_module_service_1.AdmModuleService, adm_module_repo_1.AdmModuleRepo, graylog_common_1.LoggingService],
        exports: [adm_module_service_1.AdmModuleService],
    })
], AdmModuleModule);
//# sourceMappingURL=adm-module.module.js.map