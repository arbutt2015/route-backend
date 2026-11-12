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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const adm_project_user_role_entity_1 = require("../adm-project-user-role/adm-project-user-role.entity");
const agency_entity_1 = require("../agency/agency.entity");
const adm_user_entity_1 = require("../adm-user/adm-user.entity");
let Project = class Project {
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "PROJECT_ID" }),
    __metadata("design:type", Number)
], Project.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PROJECT_NUMBER", length: 50 }),
    __metadata("design:type", String)
], Project.prototype, "projectNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "PROJECT_NAME", length: 250 }),
    __metadata("design:type", String)
], Project.prototype, "projectName", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", {
        name: "PROJECT_DESCRIPTION",
        nullable: true,
        length: 500,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectDescription", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "KML_FILE_URL", nullable: true, length: 500 }),
    __metadata("design:type", String)
], Project.prototype, "kmlFileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "GEOJSON_FILE_URL", nullable: true, length: 500 }),
    __metadata("design:type", String)
], Project.prototype, "geoJsonFileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "AGENCY_ID", nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "agencyId", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "USER_ID", nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ACTIVE", default: () => "(1)" }),
    __metadata("design:type", Boolean)
], Project.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime2", name: "DATE_CREATED", nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "datetime2", name: "DATE_UPDATED", nullable: true }),
    __metadata("design:type", Date)
], Project.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agency_entity_1.Agency, (agency) => agency.projects),
    (0, typeorm_1.JoinColumn)({ name: "AGENCY_ID", referencedColumnName: "agencyId" }),
    __metadata("design:type", agency_entity_1.Agency)
], Project.prototype, "agency", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => adm_user_entity_1.AdmUser),
    (0, typeorm_1.JoinColumn)({ name: "USER_ID", referencedColumnName: "userId" }),
    __metadata("design:type", adm_user_entity_1.AdmUser)
], Project.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_project_user_role_entity_1.AdmProjectUserRole, (admProjectUserRole) => admProjectUserRole.project),
    __metadata("design:type", Array)
], Project.prototype, "admProjectUserRoles", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Index)("PK__PROJECT__8398A786846B6B7F", ["projectId"], { unique: true }),
    (0, typeorm_1.Entity)("PROJECT", { schema: "dbo" })
], Project);
//# sourceMappingURL=project.entity.js.map