import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";
import { Agency } from "../agency/agency.entity";
export declare class AdmUser {
    userId: number;
    cognitoId: string | null;
    email: string;
    firstName: string;
    lastName: string;
    title: string | null;
    phoneNumber: string | null;
    agencyId: number | null;
    userType: number;
    isActive: boolean;
    dateCreated: Date;
    dateUpdated: Date;
    agency: Agency;
    admProjectUserRoles: AdmProjectUserRole[];
}
