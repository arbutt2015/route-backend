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
exports.AdmFeatureService = void 0;
const common_1 = require("@nestjs/common");
const adm_feature_repo_1 = require("./adm-feature.repo");
let AdmFeatureService = class AdmFeatureService {
    constructor(admFeatureRepo) {
        this.admFeatureRepo = admFeatureRepo;
    }
    async getAllFeaturesByModuleId(moduleId) {
        return await this.admFeatureRepo.getAllFeaturesByModuleId({
            where: {
                module: {
                    moduleId: moduleId,
                },
            },
        });
    }
    async getAllFeatures(filter, options) {
        return await this.admFeatureRepo.getAllFeatures(filter, options);
    }
    async createORUpdateFeature(dataObject) {
        return await this.admFeatureRepo.createORUpdateFeature(dataObject);
    }
};
exports.AdmFeatureService = AdmFeatureService;
exports.AdmFeatureService = AdmFeatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adm_feature_repo_1.AdmFeatureRepo])
], AdmFeatureService);
//# sourceMappingURL=adm-feature.service.js.map