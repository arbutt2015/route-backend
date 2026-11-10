import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProjectRegion } from "../project-region/project-region.entity";

@Index("PK__PROJECT___8398A7862643D233", ["projectRegionStatusId"], {
  unique: true,
})
@Entity("PIPELINE_REGION_STATUS", { schema: "dbo" })
export class PipelineRegionStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "PROJECT_REGION_STATUS_ID" })
  projectRegionStatusId: number;

  @Column("nvarchar", {
    name: "LOCAL_FOLDER_PATH",
    length: 500,
    default: () => "'/mnt/transconomy-data/transconomy-projects-data'",
  })
  localFolderPath: string;

  @Column("int", { name: "USERS_FOR_FILTRATION" })
  usersForFiltration: number;

  @Column("bit", { name: "UPLOAD_STATUS", default: () => "(0)" })
  uploadStatus: boolean;

  @Column("bit", { name: "VALIDATION_STATUS", default: () => "(0)" })
  validationStatus: boolean;

  @Column("bit", { name: "DOWNLOAD_STATUS", default: () => "(0)" })
  downloadStatus: boolean;

  @Column("bit", { name: "FRAME_EXTRACTION_STATUS", default: () => "(0)" })
  frameExtractionStatus: boolean;

  @Column("bit", { name: "FILTRATION_STATUS", default: () => "(0)" })
  filtrationStatus: boolean;

  @Column("bit", { name: "FINAL_DELIVERABLE_STATUS", default: () => "(0)" })
  finalDeliverableStatus: boolean;

  @Column("bit", { name: "ANONYMIZER_STATUS", default: () => "(0)" })
  anonymizerStatus: boolean;

  @Column("bit", { name: "IMAGE_VALIDATION_STATUS", default: () => "(0)" })
  imageValidationStatus: boolean;

  @Column("bit", { name: "VIDEO_VALIDATION_STATUS", default: () => "(0)" })
  videoValidationStatus: boolean;

  @Column("int", { name: "ROADVIEW_STATUS", default: () => "(0)" })
  roadViewStatus: number;

  @Column("int", { name: "PLANNER_STATUS", default: () => "(0)" })
  plannerStatus: number;

  @Column("int", { name: "LENS_STATUS", default: () => "(0)" })
  lensStatus: number;

  @Column("bit", { name: "ANALYTICS_STATUS", default: () => "(0)" })
  analyticsStatus: boolean;

  @Column("int", { name: "VIEWER_STATUS", default: () => "(0)" })
  viewerStatus: number;

  @Column("varchar", {
    name: "FINAL_DELIVERABLE_PATH",
    nullable: true,
    length: 200,
  })
  finalDeliverablePath: string | null;

  @Column("int", { name: "DUPLICATE_COUNT", default: () => "(0)" })
  duplicateCount: number;

  @Column("datetime2", { name: "DATE_CREATED", default: () => "getdate()" })
  dateCreated: Date;

  @Column("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" })
  dateUpdated: Date;

  @Column("bit", { name: "IS_QA_UPDATE", default: () => "(0)" })
  isQaUpdate: boolean;

  @ManyToOne(
    () => ProjectRegion,
    (projectRegion) => projectRegion.pipelineRegionStatuses,
    { onDelete: "CASCADE" },
  )
  @JoinColumn([{ name: "REGION_ID", referencedColumnName: "regionId" }])
  region: ProjectRegion;
}
