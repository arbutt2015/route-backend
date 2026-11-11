import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";
import { Agency } from "../agency/agency.entity";
import { AdmUser } from "../adm-user/adm-user.entity";

@Index("PK__PROJECT__8398A786846B6B7F", ["projectId"], { unique: true })
@Entity("PROJECT", { schema: "dbo" })
export class Project {
  @PrimaryGeneratedColumn({ type: "int", name: "PROJECT_ID" })
  projectId: number;

  @Column("nvarchar", { name: "PROJECT_NAME", length: 250 })
  projectName: string;

  @Column("nvarchar", {
    name: "PROJECT_DESCRIPTION",
    nullable: true,
    length: 500,
  })
  projectDescription: string | null;

  @Column("varchar", { name: "KML_FILE_URL", nullable: true, length: 500 })
  kmlFileUrl: string | null;

  @Column("varchar", { name: "GEOJSON_FILE_URL", nullable: true, length: 500 })
  geoJsonFileUrl: string | null;

  @Column("varchar", { name: "COLLECTED_FILE_URL", nullable: true, length: 500 })
  collectedFileUrl: string | null;

  @Column("int", { name: "AGENCY_ID", nullable: true })
  agencyId: number | null;

  @Column("int", { name: "USER_ID", nullable: true })
  userId: number | null;

  @Column("bit", { name: "IS_ACTIVE", default: () => "(1)" })
  isActive: boolean;

  @CreateDateColumn({ type: "datetime2", name: "DATE_CREATED", nullable: true })
  dateCreated: Date;

  @UpdateDateColumn({ type: "datetime2", name: "DATE_UPDATED", nullable: true })
  dateUpdated: Date;

  @ManyToOne(() => Agency, (agency) => agency.projects)
  @JoinColumn({ name: "AGENCY_ID", referencedColumnName: "agencyId" })
  agency: Agency;

  @ManyToOne(() => AdmUser)
  @JoinColumn({ name: "USER_ID", referencedColumnName: "userId" })
  user: AdmUser;

  @OneToMany(
    () => AdmProjectUserRole,
    (admProjectUserRole) => admProjectUserRole.project,
  )
  admProjectUserRoles: AdmProjectUserRole[];
}
