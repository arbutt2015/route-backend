import { Project } from "../project/project.entity";
import { AdmUser } from "../adm-user/adm-user.entity";
export declare class AdmProjectUserRole {
    projectId: number;
    userId: number;
    dateCreated: Date;
    project: Project;
    user: AdmUser;
}
