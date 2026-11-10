import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PipelineRegionStatus } from "../pipeline-region-status/pipeline-region-status.entity";
import { ProjectRegionCollectionKml } from "../project-region-collection-kml/project-region-collection-kml.entity";
import { Project } from "src/project/project.entity";

@Index("PK__REGION__80772D6284CEA582", ["regionId"], { unique: true })
@Index("PK_96078c819b9f6ef8eb10a0f1fb8", ["regionId"], { unique: true })
@Entity("PROJECT_REGION", { schema: "dbo" })
export class ProjectRegion {
  @PrimaryGeneratedColumn({ type: "int", name: "REGION_ID" })
  regionId: number;

  @Column("varchar", { name: "REGION_NAME", length: 100 })
  regionName: string;

  @Column("varchar", { name: "REGION_BASE_SHAPE_FILE_PATH", length: 250 })
  regionBaseShapeFilePath: string;

  @Column("bit", { name: "IS_ACTIVE" })
  isActive: boolean;

  @Column("datetime2", { name: "DATE_CREATED", default: () => "getdate()" })
  dateCreated: Date;

  @Column("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" })
  dateUpdated: Date;

  @Column("varchar", { name: "REGION_CODE", length: 20 })
  regionCode: string;

  @Column("int", {
    name: "REGION_VALIDATION_STATUS",
    nullable: false,
    default: () => "1",
  })
  validationStatus: number;

  @Column("varchar", {
    name: "REGION_KML_GEO_JSON",
    nullable: true,
    length: 150,
  })
  regionKmlGeoJson: string | null;

  @Column("bit", { name: "LOCK_REGION", default: () => "(0)" })
  lockRegion: boolean;

  @ManyToOne(() => Project, (project) => project.projectRegions)
  @JoinColumn([{ name: "PROJECT_ID", referencedColumnName: "projectId" }])
  project: Project;

  @OneToMany(
    () => PipelineRegionStatus,
    (pipelineRegionStatus) => pipelineRegionStatus.region,
  )
  pipelineRegionStatuses: PipelineRegionStatus[];

  @OneToMany(
    () => ProjectRegionCollectionKml,
    (projectRegionCollectionKml) => projectRegionCollectionKml.region,
  )
  projectRegionCollectionKmls: ProjectRegionCollectionKml[];
}
