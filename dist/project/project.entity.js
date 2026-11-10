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
const project_region_entity_1 = require("../project-region/project-region.entity");
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
        length: 255,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectDescription", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PROJECT_COUNTRY", length: 100 }),
    __metadata("design:type", String)
], Project.prototype, "projectCountry", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PROJECT_STATE", length: 100 }),
    __metadata("design:type", String)
], Project.prototype, "projectState", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PROJECT_CITY", length: 100 }),
    __metadata("design:type", String)
], Project.prototype, "projectCity", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PROJECT_STATUS", length: 25 }),
    __metadata("design:type", String)
], Project.prototype, "projectStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "AGENCY_NAME", length: 200 }),
    __metadata("design:type", String)
], Project.prototype, "agencyName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "AGENCY_REPRESENTATIVE_NAME", length: 200 }),
    __metadata("design:type", String)
], Project.prototype, "agencyRepresentativeName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "AGENCY_REPRESENTATIVE_EMAIL", length: 200 }),
    __metadata("design:type", String)
], Project.prototype, "agencyRepresentativeEmail", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "AGENCY_REPRESENTATIVE_PHONE_NUMBER",
        nullable: true,
        length: 200,
    }),
    __metadata("design:type", String)
], Project.prototype, "agencyRepresentativePhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "CLIENT_NAME", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Project.prototype, "clientName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "CLIENT_REPRESENTATIVE_PHONE_NUMBER",
        nullable: true,
        length: 200,
    }),
    __metadata("design:type", String)
], Project.prototype, "clientRepresentativePhoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "CLIENT_REPRESENTATIVE_EMAIL",
        nullable: true,
        length: 200,
    }),
    __metadata("design:type", String)
], Project.prototype, "clientRepresentativeEmail", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "CLIENT_REPRESENTATIVE_NAME",
        nullable: true,
        length: 200,
    }),
    __metadata("design:type", String)
], Project.prototype, "clientRepresentativeName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PROJECT_S3_BUCKET", length: 25 }),
    __metadata("design:type", String)
], Project.prototype, "projectS3Bucket", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "PROJECT_S3_BUCKET_FOLDER_PATH",
        nullable: true,
        length: 250,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectS3BucketFolderPath", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", {
        name: "PROJECT_DATA_EXPORT_URL",
        nullable: true,
        length: 250,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectDataExportUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_EXPORTABLE" }),
    __metadata("design:type", Boolean)
], Project.prototype, "isExportable", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ROADVIEW_ENABLED" }),
    __metadata("design:type", Boolean)
], Project.prototype, "isRoadviewEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ANALYTICS_ENABLED" }),
    __metadata("design:type", Boolean)
], Project.prototype, "isAnalyticsEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ANALYTICS_ENABLED_US" }),
    __metadata("design:type", Boolean)
], Project.prototype, "isAnalyticsEnabledUs", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ACTIVE", default: () => "(1)" }),
    __metadata("design:type", Boolean)
], Project.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_CREATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Project.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Project.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "SHAPE_FILE_URL", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Project.prototype, "shapeFileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "LAT", nullable: true, length: 50 }),
    __metadata("design:type", String)
], Project.prototype, "lat", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "LONG", nullable: true, length: 50 }),
    __metadata("design:type", String)
], Project.prototype, "long", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "DA_WORKSTATION", nullable: true, length: 50 }),
    __metadata("design:type", String)
], Project.prototype, "daWorkstation", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "AI_WORKSTATION", nullable: true, length: 50 }),
    __metadata("design:type", String)
], Project.prototype, "aiWorkstation", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "GEO_JSON_S3_FILE_PATH",
        nullable: true,
        length: 200,
    }),
    __metadata("design:type", String)
], Project.prototype, "geoJsonS3FilePath", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "BOUNDING_BOX", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Project.prototype, "boundingBox", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "PROJECT_STATE_CODE", nullable: true, length: 50 }),
    __metadata("design:type", String)
], Project.prototype, "projectStateCode", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "PROJECT_KML_GEO_JSON",
        nullable: true,
        length: 150,
    }),
    __metadata("design:type", String)
], Project.prototype, "projectKmlGeoJson", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "CREATE_BY_USER_ID", nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "createByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "LANE_MILES", nullable: false, default: () => 0 }),
    __metadata("design:type", Number)
], Project.prototype, "laneMiles", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_QA_UPDATE", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], Project.prototype, "isQaUpdate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => adm_project_user_role_entity_1.AdmProjectUserRole, (admProjectUserRole) => admProjectUserRole.project),
    __metadata("design:type", Array)
], Project.prototype, "admProjectUserRoles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_region_entity_1.ProjectRegion, (projectRegion) => projectRegion.project),
    __metadata("design:type", Array)
], Project.prototype, "projectRegions", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Index)("PK__PROJECT__8398A786846B6B7F", ["projectId"], { unique: true }),
    (0, typeorm_1.Entity)("PROJECT", { schema: "dbo" })
], Project);
//# sourceMappingURL=project.entity.js.map