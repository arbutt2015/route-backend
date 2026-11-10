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
exports.PipelineRegionStatus = void 0;
const typeorm_1 = require("typeorm");
const project_region_entity_1 = require("../project-region/project-region.entity");
let PipelineRegionStatus = class PipelineRegionStatus {
};
exports.PipelineRegionStatus = PipelineRegionStatus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "PROJECT_REGION_STATUS_ID" }),
    __metadata("design:type", Number)
], PipelineRegionStatus.prototype, "projectRegionStatusId", void 0);
__decorate([
    (0, typeorm_1.Column)("nvarchar", {
        name: "LOCAL_FOLDER_PATH",
        length: 500,
        default: () => "'/mnt/transconomy-data/transconomy-projects-data'",
    }),
    __metadata("design:type", String)
], PipelineRegionStatus.prototype, "localFolderPath", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "USERS_FOR_FILTRATION" }),
    __metadata("design:type", Number)
], PipelineRegionStatus.prototype, "usersForFiltration", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "UPLOAD_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "uploadStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "VALIDATION_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "validationStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "DOWNLOAD_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "downloadStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "FRAME_EXTRACTION_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "frameExtractionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "FILTRATION_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "filtrationStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "FINAL_DELIVERABLE_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "finalDeliverableStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "ANONYMIZER_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "anonymizerStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IMAGE_VALIDATION_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "imageValidationStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "VIDEO_VALIDATION_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "videoValidationStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "ROADVIEW_STATUS", default: () => "(0)" }),
    __metadata("design:type", Number)
], PipelineRegionStatus.prototype, "roadViewStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "PLANNER_STATUS", default: () => "(0)" }),
    __metadata("design:type", Number)
], PipelineRegionStatus.prototype, "plannerStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "LENS_STATUS", default: () => "(0)" }),
    __metadata("design:type", Number)
], PipelineRegionStatus.prototype, "lensStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "ANALYTICS_STATUS", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "analyticsStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "VIEWER_STATUS", default: () => "(0)" }),
    __metadata("design:type", Number)
], PipelineRegionStatus.prototype, "viewerStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "FINAL_DELIVERABLE_PATH",
        nullable: true,
        length: 200,
    }),
    __metadata("design:type", String)
], PipelineRegionStatus.prototype, "finalDeliverablePath", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "DUPLICATE_COUNT", default: () => "(0)" }),
    __metadata("design:type", Number)
], PipelineRegionStatus.prototype, "duplicateCount", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_CREATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], PipelineRegionStatus.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.Column)("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" }),
    __metadata("design:type", Date)
], PipelineRegionStatus.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_QA_UPDATE", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], PipelineRegionStatus.prototype, "isQaUpdate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_region_entity_1.ProjectRegion, (projectRegion) => projectRegion.pipelineRegionStatuses, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([{ name: "REGION_ID", referencedColumnName: "regionId" }]),
    __metadata("design:type", project_region_entity_1.ProjectRegion)
], PipelineRegionStatus.prototype, "region", void 0);
exports.PipelineRegionStatus = PipelineRegionStatus = __decorate([
    (0, typeorm_1.Index)("PK__PROJECT___8398A7862643D233", ["projectRegionStatusId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("PIPELINE_REGION_STATUS", { schema: "dbo" })
], PipelineRegionStatus);
//# sourceMappingURL=pipeline-region-status.entity.js.map