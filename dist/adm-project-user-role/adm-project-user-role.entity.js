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
exports.AdmProjectUserRole = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("../project/project.entity");
const adm_user_entity_1 = require("../adm-user/adm-user.entity");
const adm_role_entity_1 = require("../adm-role/adm-role.entity");
let AdmProjectUserRole = class AdmProjectUserRole {
};
exports.AdmProjectUserRole = AdmProjectUserRole;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "PROJECT_USER_ROLE_ID" }),
    __metadata("design:type", Number)
], AdmProjectUserRole.prototype, "projectUserRoleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.admProjectUserRoles, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "PROJECT_ID", referencedColumnName: "projectId" }]),
    __metadata("design:type", project_entity_1.Project)
], AdmProjectUserRole.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adm_user_entity_1.AdmUser, (admUser) => admUser.admProjectUserRoles, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "USER_ID", referencedColumnName: "userId" }]),
    __metadata("design:type", adm_user_entity_1.AdmUser)
], AdmProjectUserRole.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adm_role_entity_1.AdmRole, (admRole) => admRole.admProjectUserRoles, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "ROLE_ID", referencedColumnName: "roleId" }]),
    __metadata("design:type", adm_role_entity_1.AdmRole)
], AdmProjectUserRole.prototype, "role", void 0);
exports.AdmProjectUserRole = AdmProjectUserRole = __decorate([
    (0, typeorm_1.Index)("PK_ADM_PROJECT_USER_ROLE", ["projectUserRoleId"], { unique: true }),
    (0, typeorm_1.Entity)("ADM_PROJECT_USER_ROLE", { schema: "dbo" })
], AdmProjectUserRole);
//# sourceMappingURL=adm-project-user-role.entity.js.map