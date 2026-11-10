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
let AdmUser = class AdmUser {
};
exports.AdmUser = AdmUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "USER_ID" }),
    __metadata("design:type", Number)
], AdmUser.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "EMAIL", length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "FIRST_NAME", length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "MIDDLE_INITIAL", nullable: true, length: 50 }),
    __metadata("design:type", String)
], AdmUser.prototype, "middleInitial", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "LAST_NAME", length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "COMPANY_NAME", length: 200 }),
    __metadata("design:type", String)
], AdmUser.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "TITLE", length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "COLLECTOR_CODE", length: 10 }),
    __metadata("design:type", String)
], AdmUser.prototype, "collectorCode", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PHONE_NUMBER", length: 50 }),
    __metadata("design:type", String)
], AdmUser.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ACTIVE" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_VERIFIED" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "REQUIRE_PASSWORD_CHANGE" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "isPasswordChangeRequired", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_CREATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], AdmUser.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], AdmUser.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "ROLE_TYPE",
        length: 10,
        default: () => "user_name()",
    }),
    __metadata("design:type", String)
], AdmUser.prototype, "roleType", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "COGNITO_ID", length: 100 }),
    __metadata("design:type", String)
], AdmUser.prototype, "cognitoId", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "USERS_ACCESS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "usersAccess", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "CREATE_PROJECT_ACCESS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "createProjectAccess", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "ASSETS_ACCESS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "assetsAccess", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_SD_USER", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], AdmUser.prototype, "isSdUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_project_user_role_entity_1.AdmProjectUserRole, (admProjectUserRole) => admProjectUserRole.user),
    __metadata("design:type", Array)
], AdmUser.prototype, "admProjectUserRoles", void 0);
exports.AdmUser = AdmUser = __decorate([
    (0, typeorm_1.Index)("PK__USER__F3BEEBFFC11F1925", ["userId"], { unique: true }),
    (0, typeorm_1.Index)("PK_83bc997badef7070d50845f1e9b", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("ADM_USER", { schema: "dbo" })
], AdmUser);
//# sourceMappingURL=adm-user.entity.js.map