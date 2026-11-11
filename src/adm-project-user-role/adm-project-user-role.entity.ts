import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Project } from "../project/project.entity";
import { AdmUser } from "../adm-user/adm-user.entity";

@Entity("PROJECT_USER", { schema: "dbo" })
export class AdmProjectUserRole {
  @PrimaryColumn({ type: "int", name: "PROJECT_ID" })
  projectId: number;

  @PrimaryColumn({ type: "int", name: "USER_ID" })
  userId: number;

  @CreateDateColumn({ type: "datetime2", name: "DATE_CREATED", nullable: true })
  dateCreated: Date;

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
}
