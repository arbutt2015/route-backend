import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";
export declare class AdmRole {
    roleId: number;
    roleName: string;
    roleCode: string;
    roleDescription: string;
    admProjectUserRoles: AdmProjectUserRole[];
}
