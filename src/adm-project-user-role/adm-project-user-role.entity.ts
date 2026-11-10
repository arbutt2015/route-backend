import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "../project/project.entity";
import { AdmUser } from "../adm-user/adm-user.entity";
import { AdmRole } from "../adm-role/adm-role.entity";

@Index("PK_ADM_PROJECT_USER_ROLE", ["projectUserRoleId"], { unique: true })
@Entity("ADM_PROJECT_USER_ROLE", { schema: "dbo" })
export class AdmProjectUserRole {
  @PrimaryGeneratedColumn({ type: "int", name: "PROJECT_USER_ROLE_ID" })
  projectUserRoleId: number;

  @ManyToOne(() => Project, (project) => project.admProjectUserRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "PROJECT_ID", referencedColumnName: "projectId" }])
  project: Project;

  @ManyToOne(() => AdmUser, (admUser) => admUser.admProjectUserRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "USER_ID", referencedColumnName: "userId" }])
  user: AdmUser;

  @ManyToOne(() => AdmRole, (admRole) => admRole.admProjectUserRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "ROLE_ID", referencedColumnName: "roleId" }])
  role: AdmRole;
}
