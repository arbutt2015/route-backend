import { AdmProjectUserRole } from "../adm-project-user-role/adm-project-user-role.entity";
export declare class AdmUser {
    userId: number;
    email: string;
    firstName: string;
    middleInitial: string | null;
    lastName: string;
    companyName: string;
    title: string;
    collectorCode: string;
    phoneNumber: string;
    isActive: boolean;
    isVerified: boolean;
    isPasswordChangeRequired: boolean;
    dateCreated: Date;
    dateUpdated: Date;
    roleType: string;
    cognitoId: string;
    usersAccess: boolean;
    createProjectAccess: boolean;
    assetsAccess: boolean;
    isSdUser: boolean;
    admProjectUserRoles: AdmProjectUserRole[];
}
