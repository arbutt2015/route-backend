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

@Index("PK__USER__F3BEEBFFC11F1925", ["userId"], { unique: true })
@Entity("USER", { schema: "dbo" })
export class AdmUser {
  @PrimaryGeneratedColumn({ type: "int", name: "USER_ID" })
  userId: number;

  @Column("varchar", { name: "COGNITO_GUID", nullable: true, length: 100 })
  cognitoId: string | null;

  @Column("nvarchar", { name: "EMAIL_ADDRESS", length: 200 })
  email: string;

  @Column("nvarchar", { name: "FIRST_NAME", length: 100 })
  firstName: string;

  @Column("nvarchar", { name: "LAST_NAME", length: 100 })
  lastName: string;

  @Column("varchar", { name: "TITLE", nullable: true, length: 100 })
  title: string | null;

  @Column("varchar", { name: "PHONE", nullable: true, length: 50 })
  phoneNumber: string | null;

  @Column("int", { name: "AGENCY_ID", nullable: true })
  agencyId: number | null;

  // 1 = agency user, 2 = agency admin, 3 = super user
  @Column("int", { name: "USER_TYPE", default: () => 1 })
  userType: number;

  @Column("bit", { name: "IS_ACTIVE", default: () => "(1)" })
  isActive: boolean;

  @CreateDateColumn({ type: "datetime2", name: "DATE_CREATED", nullable: true })
  dateCreated: Date;

  @UpdateDateColumn({ type: "datetime2", name: "DATE_UPDATED", nullable: true })
  dateUpdated: Date;

  @ManyToOne(() => Agency, (agency) => agency.users)
  @JoinColumn({ name: "AGENCY_ID", referencedColumnName: "agencyId" })
  agency: Agency;

  @OneToMany(
    () => AdmProjectUserRole,
    (admProjectUserRole) => admProjectUserRole.user,
  )
  admProjectUserRoles: AdmProjectUserRole[];
}
