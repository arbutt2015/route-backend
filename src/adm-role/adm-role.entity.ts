import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";

@Index("PK_ADM_ROLE", ["roleId"], { unique: true })
@Entity("ADM_ROLE", { schema: "dbo" })
export class AdmRole {
  @PrimaryGeneratedColumn({ type: "int", name: "ROLE_ID" })
  roleId: number;

  @Column("varchar", { name: "ROLE_NAME", length: 100 })
  roleName: string;
  @Column("varchar", { name: "ROLE_CODE", length: 20 })
  roleCode: string;
  @Column("varchar", { name: "ROLE_DESCRIPTION", length: 200 })
  roleDescription: string;

  @OneToMany(
    () => AdmProjectUserRole,
    (admProjectUserRole) => admProjectUserRole.role,
  )
  admProjectUserRoles: AdmProjectUserRole[];
}
