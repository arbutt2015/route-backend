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
exports.AdmRoleFeatureRepo = void 0;
const common_1 = require("@nestjs/common");
const gene_repo_service_1 = require("../gene-repo/gene-repo.service");
let AdmRoleFeatureRepo = class AdmRoleFeatureRepo {
    constructor(geneRepoService) {
        this.geneRepoService = geneRepoService;
        (async () => {
            this.admRoleFeatureRepository =
                await this.geneRepoService.getRepository("AdmRoleFeature");
        })();
    }
    async createRoleFeature(createRoleWithFeaturesDto) {
        return await this.geneRepoService.create(this.admRoleFeatureRepository, createRoleWithFeaturesDto);
    }
    async getAllRolesFeatures() {
        return await this.geneRepoService.getAll(this.admRoleFeatureRepository);
    }
    async getRolesAndFeaturesByIds(filter, option) {
        return await this.geneRepoService.getOne(this.admRoleFeatureRepository, filter, option);
    }
    async getRolesFeaturesByRoleId(filter, option) {
        return await this.geneRepoService.getAll(this.admRoleFeatureRepository, filter, option);
    }
};
exports.AdmRoleFeatureRepo = AdmRoleFeatureRepo;
exports.AdmRoleFeatureRepo = AdmRoleFeatureRepo = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gene_repo_service_1.GeneRepoService])
], AdmRoleFeatureRepo);
//# sourceMappingURL=adm-role-feature.repo.js.map