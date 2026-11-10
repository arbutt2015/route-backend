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
exports.AdmRoleFeature = void 0;
const typeorm_1 = require("typeorm");
const adm_feature_entity_1 = require("../adm-feature/adm-feature.entity");
let AdmRoleFeature = class AdmRoleFeature {
};
exports.AdmRoleFeature = AdmRoleFeature;
__decorate([
    (0, typeorm_1.Column)("int", { primary: true, name: "ROLE_ID" }),
    __metadata("design:type", Number)
], AdmRoleFeature.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { primary: true, name: "FEATURE_ID" }),
    __metadata("design:type", Number)
], AdmRoleFeature.prototype, "featureId", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "CREATE_PERMISSION" }),
    __metadata("design:type", Boolean)
], AdmRoleFeature.prototype, "createPermission", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "READ_PERMISSIONS" }),
    __metadata("design:type", Boolean)
], AdmRoleFeature.prototype, "readPermissions", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "UPDATE_PERMISSION" }),
    __metadata("design:type", Boolean)
], AdmRoleFeature.prototype, "updatePermission", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "DELETE_PERMISSIONS" }),
    __metadata("design:type", Boolean)
], AdmRoleFeature.prototype, "deletePermissions", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adm_feature_entity_1.AdmFeature, (admFeature) => admFeature.admRoleFeatures, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "FEATURE_ID", referencedColumnName: "featureId" }]),
    __metadata("design:type", adm_feature_entity_1.AdmFeature)
], AdmRoleFeature.prototype, "feature", void 0);
exports.AdmRoleFeature = AdmRoleFeature = __decorate([
    (0, typeorm_1.Index)("PK_ROLE_FEATURE", ["roleId", "featureId"], { unique: true }),
    (0, typeorm_1.Entity)("ADM_ROLE_FEATURE", { schema: "dbo" })
], AdmRoleFeature);
//# sourceMappingURL=adm-role-feature.entity.js.map