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
exports.AdmProjectUserRoleRepo = void 0;
const common_1 = require("@nestjs/common");
const gene_repo_service_1 = require("../gene-repo/gene-repo.service");
let AdmProjectUserRoleRepo = class AdmProjectUserRoleRepo {
    constructor(geneRepoService) {
        this.geneRepoService = geneRepoService;
        (async () => {
            this.projectUserRoleRepository =
                await this.geneRepoService.getRepository("AdmProjectUserRole");
        })();
    }
    async createProjectUserRole(createProjectUserRoleDto) {
        return await this.geneRepoService.create(this.projectUserRoleRepository, {
            projectId: createProjectUserRoleDto.projectId,
            userId: createProjectUserRoleDto.userId,
        });
    }
    async getAllProjectUsersRoles(filter, options) {
        return await this.geneRepoService.getAll(this.projectUserRoleRepository, filter, options);
    }
    async getAllProjectUsersRole(filter, options) {
        return await this.geneRepoService.getAll(this.projectUserRoleRepository, filter, options);
    }
    async deleteProjectUserRole(projectId, userId) {
        await this.projectUserRoleRepository.delete({ projectId, userId });
    }
};
exports.AdmProjectUserRoleRepo = AdmProjectUserRoleRepo;
exports.AdmProjectUserRoleRepo = AdmProjectUserRoleRepo = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gene_repo_service_1.GeneRepoService])
], AdmProjectUserRoleRepo);
//# sourceMappingURL=adm-project-user-role.repo.js.map