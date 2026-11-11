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
exports.AdmUser = void 0;
const typeorm_1 = require("typeorm");
const adm_project_user_role_entity_1 = require("../adm-project-user-role/adm-project-user-role.entity");
const agency_entity_1 = require("../agency/agency.entity");
let AdmUser = class AdmUser {
};
exports.AdmUser = AdmUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "USER_ID" }),
    __metadata("design:type", Number)
], AdmUser.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "COGNITO_GUID", nullable: true, length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "cognitoId", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "EMAIL_ADDRESS", length: 200 }),
    __metadata("design:type", String)
], AdmUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "FIRST_NAME", length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "LAST_NAME", length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "TITLE", nullable: true, length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PHONE", nullable: true, length: 50 }),
    __metadata("design:type", String)
], AdmUser.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "AGENCY_ID", nullable: true }),
    __metadata("design:type", Number)
], AdmUser.prototype, "agencyId", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "USER_TYPE", default: () => 1 }),
    __metadata("design:type", Number)
], AdmUser.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ACTIVE", default: () => "(1)" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime2", name: "DATE_CREATED", nullable: true }),
    __metadata("design:type", Date)
], AdmUser.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "datetime2", name: "DATE_UPDATED", nullable: true }),
    __metadata("design:type", Date)
], AdmUser.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agency_entity_1.Agency, (agency) => agency.users),
    (0, typeorm_1.JoinColumn)({ name: "AGENCY_ID", referencedColumnName: "agencyId" }),
    __metadata("design:type", agency_entity_1.Agency)
], AdmUser.prototype, "agency", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_project_user_role_entity_1.AdmProjectUserRole, (admProjectUserRole) => admProjectUserRole.user),
    __metadata("design:type", Array)
], AdmUser.prototype, "admProjectUserRoles", void 0);
exports.AdmUser = AdmUser = __decorate([
    (0, typeorm_1.Index)("PK__USER__F3BEEBFFC11F1925", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("USER", { schema: "dbo" })
], AdmUser);
//# sourceMappingURL=adm-user.entity.js.map