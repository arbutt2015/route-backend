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
exports.AdmModule = void 0;
const typeorm_1 = require("typeorm");
const adm_feature_entity_1 = require("../adm-feature/adm-feature.entity");
let AdmModule = class AdmModule {
};
exports.AdmModule = AdmModule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "MODULE_ID" }),
    __metadata("design:type", Number)
], AdmModule.prototype, "moduleId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "MODULE_NAME", length: 100 }),
    __metadata("design:type", String)
], AdmModule.prototype, "moduleName", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "SORT_ORDER" }),
    __metadata("design:type", Number)
], AdmModule.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_feature_entity_1.AdmFeature, (admFeature) => admFeature.module),
    __metadata("design:type", Array)
], AdmModule.prototype, "admFeatures", void 0);
exports.AdmModule = AdmModule = __decorate([
    (0, typeorm_1.Index)("PK_ADM_MODULE", ["moduleId"], { unique: true }),
    (0, typeorm_1.Entity)("ADM_MODULE", { schema: "dbo" })
], AdmModule);
//# sourceMappingURL=adm-module.entity.js.map