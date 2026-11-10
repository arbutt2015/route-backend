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
exports.ProjectRegionCollectionKml = void 0;
const typeorm_1 = require("typeorm");
const project_region_entity_1 = require("../project-region/project-region.entity");
let ProjectRegionCollectionKml = class ProjectRegionCollectionKml {
};
exports.ProjectRegionCollectionKml = ProjectRegionCollectionKml;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "REGION_COLLECTION_KML_ID" }),
    __metadata("design:type", Number)
], ProjectRegionCollectionKml.prototype, "regionCollectionKmlId", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "COLLECTION_KML_PATH", length: 200 }),
    __metadata("design:type", String)
], ProjectRegionCollectionKml.prototype, "collectionKmlPath", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "COLLECTION_ROUND" }),
    __metadata("design:type", Number)
], ProjectRegionCollectionKml.prototype, "collectionRound", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "COLLECTION_NAME", length: 100 }),
    __metadata("design:type", String)
], ProjectRegionCollectionKml.prototype, "collectionName", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "COLLECTION_KML_GEO_JSON_PATH",
        nullable: true,
        length: 150,
    }),
    __metadata("design:type", String)
], ProjectRegionCollectionKml.prototype, "collectionKmlGeoJsonPath", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_ACTIVE", default: () => "(0)" }),
    __metadata("design:type", Boolean)
], ProjectRegionCollectionKml.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)("bit", { name: "IS_PENDING", nullable: true, default: () => "(1)" }),
    __metadata("design:type", Boolean)
], ProjectRegionCollectionKml.prototype, "isPending", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_region_entity_1.ProjectRegion, (projectRegion) => projectRegion.projectRegionCollectionKmls, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([{ name: "REGION_ID", referencedColumnName: "regionId" }]),
    __metadata("design:type", project_region_entity_1.ProjectRegion)
], ProjectRegionCollectionKml.prototype, "region", void 0);
exports.ProjectRegionCollectionKml = ProjectRegionCollectionKml = __decorate([
    (0, typeorm_1.Index)("PK_PROJECT_REGION_RECOLLECTION_KML", ["regionCollectionKmlId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("PROJECT_REGION_COLLECTION_KML", { schema: "dbo" })
], ProjectRegionCollectionKml);
//# sourceMappingURL=project-region-collection-kml.entity.js.map