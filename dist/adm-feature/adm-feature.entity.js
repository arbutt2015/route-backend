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
exports.AdmFeature = void 0;
const typeorm_1 = require("typeorm");
const adm_module_entity_1 = require("../adm-module/adm-module.entity");
const adm_role_feature_entity_1 = require("../adm-role-feature/adm-role-feature.entity");
let AdmFeature = class AdmFeature {
};
exports.AdmFeature = AdmFeature;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "FEATURE_ID" }),
    __metadata("design:type", Number)
], AdmFeature.prototype, "featureId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "FEATURE_NAME", length: 100 }),
    __metadata("design:type", String)
], AdmFeature.prototype, "featureName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "FEATURE_URL", length: 200 }),
    __metadata("design:type", String)
], AdmFeature.prototype, "featureUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "SORT_ORDER" }),
    __metadata("design:type", Number)
], AdmFeature.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adm_module_entity_1.AdmModule, (admModule) => admModule.admFeatures, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "MODULE_ID", referencedColumnName: "moduleId" }]),
    __metadata("design:type", adm_module_entity_1.AdmModule)
], AdmFeature.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_role_feature_entity_1.AdmRoleFeature, (admRoleFeature) => admRoleFeature.feature),
    __metadata("design:type", Array)
], AdmFeature.prototype, "admRoleFeatures", void 0);
exports.AdmFeature = AdmFeature = __decorate([
    (0, typeorm_1.Index)("PK_ADM_FEATURE", ["featureId"], { unique: true }),
    (0, typeorm_1.Entity)("ADM_FEATURE", { schema: "dbo" })
], AdmFeature);
//# sourceMappingURL=adm-feature.entity.js.map