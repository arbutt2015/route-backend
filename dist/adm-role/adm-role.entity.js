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
exports.AdmRole = void 0;
const typeorm_1 = require("typeorm");
const adm_project_user_role_entity_1 = require("../adm-project-user-role/adm-project-user-role.entity");
let AdmRole = class AdmRole {
};
exports.AdmRole = AdmRole;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "ROLE_ID" }),
    __metadata("design:type", Number)
], AdmRole.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "ROLE_NAME", length: 100 }),
    __metadata("design:type", String)
], AdmRole.prototype, "roleName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "ROLE_CODE", length: 20 }),
    __metadata("design:type", String)
], AdmRole.prototype, "roleCode", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "ROLE_DESCRIPTION", length: 200 }),
    __metadata("design:type", String)
], AdmRole.prototype, "roleDescription", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_project_user_role_entity_1.AdmProjectUserRole, (admProjectUserRole) => admProjectUserRole.role),
    __metadata("design:type", Array)
], AdmRole.prototype, "admProjectUserRoles", void 0);
exports.AdmRole = AdmRole = __decorate([
    (0, typeorm_1.Index)("PK_ADM_ROLE", ["roleId"], { unique: true }),
    (0, typeorm_1.Entity)("ADM_ROLE", { schema: "dbo" })
], AdmRole);
//# sourceMappingURL=adm-role.entity.js.map