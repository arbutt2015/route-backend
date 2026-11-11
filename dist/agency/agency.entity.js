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
exports.Agency = void 0;
const typeorm_1 = require("typeorm");
const adm_user_entity_1 = require("../adm-user/adm-user.entity");
const project_entity_1 = require("../project/project.entity");
let Agency = class Agency {
};
exports.Agency = Agency;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "AGENCY_ID" }),
    __metadata("design:type", Number)
], Agency.prototype, "agencyId", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", { name: "AGENCY_NAME", length: 200 }),
    __metadata("design:type", String)
], Agency.prototype, "agencyName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PHONE", nullable: true, length: 50 }),
    __metadata("design:type", String)
], Agency.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "WEBSITE", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Agency.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "CITY", nullable: true, length: 100 }),
    __metadata("design:type", String)
], Agency.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "STATE", nullable: true, length: 100 }),
    __metadata("design:type", String)
], Agency.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "ZIP_CODE", nullable: true, length: 20 }),
    __metadata("design:type", String)
], Agency.prototype, "zipCode", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "ADDRESS_LINE_1", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Agency.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "ADDRESS_LINE_2", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Agency.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "IMAGE_URL", nullable: true, length: 500 }),
    __metadata("design:type", String)
], Agency.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "AGENCY_CODE", nullable: true, length: 50 }),
    __metadata("design:type", String)
], Agency.prototype, "agencyCode", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "COUNTRY", nullable: true, length: 100 }),
    __metadata("design:type", String)
], Agency.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime2", name: "DATE_CREATED", nullable: true }),
    __metadata("design:type", Date)
], Agency.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "datetime2", name: "DATE_UPDATED", nullable: true }),
    __metadata("design:type", Date)
], Agency.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_user_entity_1.AdmUser, (user) => user.agency),
    __metadata("design:type", Array)
], Agency.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, (project) => project.agency),
    __metadata("design:type", Array)
], Agency.prototype, "projects", void 0);
exports.Agency = Agency = __decorate([
    (0, typeorm_1.Index)("PK_AGENCY", ["agencyId"], { unique: true }),
    (0, typeorm_1.Entity)("AGENCY", { schema: "dbo" })
], Agency);
//# sourceMappingURL=agency.entity.js.map