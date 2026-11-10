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
exports.ProjectRegion = void 0;
const typeorm_1 = require("typeorm");
const pipeline_region_status_entity_1 = require("../pipeline-region-status/pipeline-region-status.entity");
const project_region_collection_kml_entity_1 = require("../project-region-collection-kml/project-region-collection-kml.entity");
const project_entity_1 = require("../project/project.entity");
let ProjectRegion = class ProjectRegion {
};
exports.ProjectRegion = ProjectRegion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "REGION_ID" }),
    __metadata("design:type", Number)
], ProjectRegion.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "REGION_NAME", length: 100 }),
    __metadata("design:type", String)
], ProjectRegion.prototype, "regionName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "REGION_BASE_SHAPE_FILE_PATH", length: 250 }),
    __metadata("design:type", String)
], ProjectRegion.prototype, "regionBaseShapeFilePath", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ACTIVE" }),
    __metadata("design:type", Boolean)
], ProjectRegion.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_CREATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], ProjectRegion.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], ProjectRegion.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "REGION_CODE", length: 20 }),
    __metadata("design:type", String)
], ProjectRegion.prototype, "regionCode", void 0);
__decorate([
    (0, typeorm_1.Column)("int", {
        name: "REGION_VALIDATION_STATUS",
        nullable: false,
        default: () => "1",
    }),
    __metadata("design:type", Number)
], ProjectRegion.prototype, "validationStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "REGION_KML_GEO_JSON",
        nullable: true,
        length: 150,
    }),
    __metadata("design:type", String)
], ProjectRegion.prototype, "regionKmlGeoJson", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "LOCK_REGION", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], ProjectRegion.prototype, "lockRegion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.projectRegions),
    (0, typeorm_1.JoinColumn)([{ name: "PROJECT_ID", referencedColumnName: "projectId" }]),
    __metadata("design:type", project_entity_1.Project)
], ProjectRegion.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pipeline_region_status_entity_1.PipelineRegionStatus, (pipelineRegionStatus) => pipelineRegionStatus.region),
    __metadata("design:type", Array)
], ProjectRegion.prototype, "pipelineRegionStatuses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_region_collection_kml_entity_1.ProjectRegionCollectionKml, (projectRegionCollectionKml) => projectRegionCollectionKml.region),
    __metadata("design:type", Array)
], ProjectRegion.prototype, "projectRegionCollectionKmls", void 0);
exports.ProjectRegion = ProjectRegion = __decorate([
    (0, typeorm_1.Index)("PK__REGION__80772D6284CEA582", ["regionId"], { unique: true }),
    (0, typeorm_1.Index)("PK_96078c819b9f6ef8eb10a0f1fb8", ["regionId"], { unique: true }),
    (0, typeorm_1.Entity)("PROJECT_REGION", { schema: "dbo" })
], ProjectRegion);
//# sourceMappingURL=project-region.entity.js.map