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
exports.AdmRoleRepo = void 0;
const common_1 = require("@nestjs/common");
const gene_repo_service_1 = require("../gene-repo/gene-repo.service");
let AdmRoleRepo = class AdmRoleRepo {
    constructor(geneRepoService) {
        this.geneRepoService = geneRepoService;
        (async () => {
            this.admRoleRepository =
                await this.geneRepoService.getRepository("AdmRole");
        })();
    }
    async createRole(roleData) {
        const role = await this.geneRepoService.create(this.admRoleRepository, roleData);
        return role;
    }
    async getAllRoles(filter, options) {
        return await this.geneRepoService.getAll(this.admRoleRepository, filter, options);
    }
    async deleteRole(filter) {
        return await this.geneRepoService.deleteOne(this.admRoleRepository, filter);
    }
};
exports.AdmRoleRepo = AdmRoleRepo;
exports.AdmRoleRepo = AdmRoleRepo = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gene_repo_service_1.GeneRepoService])
], AdmRoleRepo);
//# sourceMappingURL=adm-role.repo.js.map