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
exports.AdmModuleService = void 0;
const common_1 = require("@nestjs/common");
const adm_module_repo_1 = require("./adm-module.repo");
let AdmModuleService = class AdmModuleService {
    constructor(moduleRepo) {
        this.moduleRepo = moduleRepo;
    }
    async getAllModules(filter, options) {
        return await this.moduleRepo.getAllModules(filter, options);
    }
    async createORUpdateModule(createModuleDto) {
        return await this.moduleRepo.createORUpdateModule(createModuleDto);
    }
};
exports.AdmModuleService = AdmModuleService;
exports.AdmModuleService = AdmModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adm_module_repo_1.AdmModuleRepo])
], AdmModuleService);
//# sourceMappingURL=adm-module.service.js.map