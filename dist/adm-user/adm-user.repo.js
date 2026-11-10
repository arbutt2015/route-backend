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
exports.AdmUserRepo = void 0;
const common_1 = require("@nestjs/common");
const gene_repo_service_1 = require("../gene-repo/gene-repo.service");
let AdmUserRepo = class AdmUserRepo {
    constructor(geneRepoService) {
        this.geneRepoService = geneRepoService;
        (async () => {
            this.userRepository = await this.geneRepoService.getRepository("AdmUser");
        })();
    }
    async getAllUsers(filter, options) {
        const users = await this.geneRepoService.getAll(this.userRepository, filter, options);
        return users;
    }
    async getSdUsers(filter, options) {
        const users = await this.geneRepoService.getAll(this.userRepository, filter, options);
        return users;
    }
    async createUser(user) {
        return this.geneRepoService.create(this.userRepository, user);
    }
    async getUser(filter, options) {
        return await this.geneRepoService.getOne(this.userRepository, filter, options);
    }
    async getDeleteById(id) {
        return await this.geneRepoService.deleteById(this.userRepository, id);
    }
    async updateUserByWhereAndGetData(updateFilter, updateBody, findFilter, options) {
        return await this.geneRepoService.updateByWhereAndGetData(this.userRepository, updateFilter, updateBody, findFilter, options);
    }
};
exports.AdmUserRepo = AdmUserRepo;
exports.AdmUserRepo = AdmUserRepo = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gene_repo_service_1.GeneRepoService])
], AdmUserRepo);
//# sourceMappingURL=adm-user.repo.js.map