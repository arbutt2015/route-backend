import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";
import { Agency } from "../agency/agency.entity";
import { AdmUser } from "../adm-user/adm-user.entity";
export declare class Project {
    projectId: number;
    projectNumber: string;
    projectName: string;
    projectDescription: string | null;
    kmlFileUrl: string | null;
    geoJsonFileUrl: string | null;
    agencyId: number | null;
    userId: number | null;
    isActive: boolean;
    dateCreated: Date;
    dateUpdated: Date;
    agency: Agency;
    user: AdmUser;
    admProjectUserRoles: AdmProjectUserRole[];
}
