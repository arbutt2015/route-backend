"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneRepoModule = void 0;
const common_1 = require("@nestjs/common");
const gene_repo_service_1 = require("./gene-repo.service");
let GeneRepoModule = class GeneRepoModule {
};
exports.GeneRepoModule = GeneRepoModule;
exports.GeneRepoModule = GeneRepoModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [gene_repo_service_1.GeneRepoService],
        exports: [gene_repo_service_1.GeneRepoService],
    })
], GeneRepoModule);
//# sourceMappingURL=gene-repo.module.js.map