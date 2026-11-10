import { Project } from "../project/project.entity";
import { AdmUser } from "../adm-user/adm-user.entity";
import { AdmRole } from "../adm-role/adm-role.entity";
export declare class AdmProjectUserRole {
    projectUserRoleId: number;
    project: Project;
    user: AdmUser;
    role: AdmRole;
}
