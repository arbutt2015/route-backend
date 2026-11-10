import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";
import { ProjectRegion } from "src/project-region/project-region.entity";

@Index("PK__PROJECT__8398A786846B6B7F", ["projectId"], { unique: true })
@Entity("PROJECT", { schema: "dbo" })
export class Project {
  @PrimaryGeneratedColumn({ type: "int", name: "PROJECT_ID" })
  projectId: number;

  @Column("varchar", { name: "PROJECT_NUMBER", length: 50 })
  projectNumber: string;

  @Column("nvarchar", { name: "PROJECT_NAME", length: 250 })
  projectName: string;

  @Column("nvarchar", {
    name: "PROJECT_DESCRIPTION",
    nullable: true,
    length: 255,
  })
  projectDescription: string | null;

  @Column("varchar", { name: "PROJECT_COUNTRY", length: 100 })
  projectCountry: string;

  @Column("varchar", { name: "PROJECT_STATE", length: 100 })
  projectState: string;

  @Column("varchar", { name: "PROJECT_CITY", length: 100 })
  projectCity: string;

  @Column("varchar", { name: "PROJECT_STATUS", length: 25 })
  projectStatus: string;

  @Column("varchar", { name: "AGENCY_NAME", length: 200 })
  agencyName: string;

  @Column("varchar", { name: "AGENCY_REPRESENTATIVE_NAME", length: 200 })
  agencyRepresentativeName: string;

  @Column("varchar", { name: "AGENCY_REPRESENTATIVE_EMAIL", length: 200 })
  agencyRepresentativeEmail: string;

  @Column("varchar", {
    name: "AGENCY_REPRESENTATIVE_PHONE_NUMBER",
    nullable: true,
    length: 200,
  })
  agencyRepresentativePhoneNumber: string | null;

  @Column("varchar", { name: "CLIENT_NAME", nullable: true, length: 200 })
  clientName: string | null;

  @Column("varchar", {
    name: "CLIENT_REPRESENTATIVE_PHONE_NUMBER",
    nullable: true,
    length: 200,
  })
  clientRepresentativePhoneNumber: string | null;

  @Column("varchar", {
    name: "CLIENT_REPRESENTATIVE_EMAIL",
    nullable: true,
    length: 200,
  })
  clientRepresentativeEmail: string | null;

  @Column("varchar", {
    name: "CLIENT_REPRESENTATIVE_NAME",
    nullable: true,
    length: 200,
  })
  clientRepresentativeName: string | null;

  @Column("varchar", { name: "PROJECT_S3_BUCKET", length: 25 })
  projectS3Bucket: string;

  @Column("varchar", {
    name: "PROJECT_S3_BUCKET_FOLDER_PATH",
    nullable: true,
    length: 250,
  })
  projectS3BucketFolderPath: string | null;

  @Column("nvarchar", {
    name: "PROJECT_DATA_EXPORT_URL",
    nullable: true,
    length: 250,
  })
  projectDataExportUrl: string | null;

  @Column("bit", { name: "IS_EXPORTABLE" })
  isExportable: boolean;

  @Column("bit", { name: "IS_ROADVIEW_ENABLED" })
  isRoadviewEnabled: boolean;

  @Column("bit", { name: "IS_ANALYTICS_ENABLED" })
  isAnalyticsEnabled: boolean;

  @Column("bit", { name: "IS_ANALYTICS_ENABLED_US" })
  isAnalyticsEnabledUs: boolean;

  @Column("bit", { name: "IS_ACTIVE", default: () => "(1)" })
  isActive: boolean;

  @Column("datetime2", { name: "DATE_CREATED", default: () => "getdate()" })
  dateCreated: Date;

  @Column("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" })
  dateUpdated: Date;

  @Column("varchar", { name: "SHAPE_FILE_URL", nullable: true, length: 200 })
  shapeFileUrl: string | null;

  @Column("varchar", { name: "LAT", nullable: true, length: 50 })
  lat: string | null;

  @Column("varchar", { name: "LONG", nullable: true, length: 50 })
  long: string | null;

  @Column("varchar", { name: "DA_WORKSTATION", nullable: true, length: 50 })
  daWorkstation: string | null;

  @Column("varchar", { name: "AI_WORKSTATION", nullable: true, length: 50 })
  aiWorkstation: string | null;

  @Column("varchar", {
    name: "GEO_JSON_S3_FILE_PATH",
    nullable: true,
    length: 200,
  })
  geoJsonS3FilePath: string | null;

  @Column("varchar", { name: "BOUNDING_BOX", nullable: true, length: 200 })
  boundingBox: string | null;

  @Column("varchar", { name: "PROJECT_STATE_CODE", nullable: true, length: 50 })
  projectStateCode: string | null;

  @Column("varchar", {
    name: "PROJECT_KML_GEO_JSON",
    nullable: true,
    length: 150,
  })
  projectKmlGeoJson: string | null;

  @Column("int", { name: "CREATE_BY_USER_ID", nullable: true })
  createByUserId: number | null;

  @Column("int", { name: "LANE_MILES", nullable: false, default: () => 0 })
  laneMiles: number;

  @Column("bit", { name: "IS_QA_UPDATE", default: () => "(0)" })
  isQaUpdate: boolean;

  @OneToMany(
    () => AdmProjectUserRole,
    (admProjectUserRole) => admProjectUserRole.project,
  )
  admProjectUserRoles: AdmProjectUserRole[];

  @OneToMany(() => ProjectRegion, (projectRegion) => projectRegion.project)
  projectRegions: ProjectRegion[];
}
