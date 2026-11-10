import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";

@Index("PK__USER__F3BEEBFFC11F1925", ["userId"], { unique: true })
@Index("PK_83bc997badef7070d50845f1e9b", ["userId"], { unique: true })
@Entity("ADM_USER", { schema: "dbo" })
export class AdmUser {
  @PrimaryGeneratedColumn({ type: "int", name: "USER_ID" })
  userId: number;

  @Column("nvarchar", { name: "EMAIL", length: 100 })
  email: string;

  @Column("nvarchar", { name: "FIRST_NAME", length: 100 })
  firstName: string;

  @Column("varchar", { name: "MIDDLE_INITIAL", nullable: true, length: 50 })
  middleInitial: string | null;

  @Column("nvarchar", { name: "LAST_NAME", length: 100 })
  lastName: string;

  @Column("varchar", { name: "COMPANY_NAME", length: 200 })
  companyName: string;

  @Column("varchar", { name: "TITLE", length: 100 })
  title: string;

  @Column("varchar", { name: "COLLECTOR_CODE", length: 10 })
  collectorCode: string;

  @Column("varchar", { name: "PHONE_NUMBER", length: 50 })
  phoneNumber: string;

  @Column("bit", { name: "IS_ACTIVE" })
  isActive: boolean;

  @Column("bit", { name: "IS_VERIFIED" })
  isVerified: boolean;

  @Column("bit", { name: "REQUIRE_PASSWORD_CHANGE" })
  isPasswordChangeRequired: boolean;

  @Column("datetime2", { name: "DATE_CREATED", default: () => "getdate()" })
  dateCreated: Date;

  @Column("datetime2", { name: "DATE_UPDATED", default: () => "getdate()" })
  dateUpdated: Date;

  @Column("varchar", {
    name: "ROLE_TYPE",
    length: 10,
    default: () => "user_name()",
  })
  roleType: string;

  @Column("varchar", { name: "COGNITO_ID", length: 100 })
  cognitoId: string;

  @Column("bit", { name: "USERS_ACCESS", default: () => "(0)" })
  usersAccess: boolean;

  @Column("bit", { name: "CREATE_PROJECT_ACCESS", default: () => "(0)" })
  createProjectAccess: boolean;

  @Column("bit", { name: "ASSETS_ACCESS", default: () => "(0)" })
  assetsAccess: boolean;

  @Column("bit", { name: "IS_SD_USER", default: () => "(0)" })
  isSdUser: boolean;

  @OneToMany(
    () => AdmProjectUserRole,
    (admProjectUserRole) => admProjectUserRole.user,
  )
  admProjectUserRoles: AdmProjectUserRole[];
}
