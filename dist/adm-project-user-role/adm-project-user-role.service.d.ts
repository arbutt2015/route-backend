import { AdmProjectUserRoleRepo } from "./adm-project-user-role.repo";
export declare class AdmProjectUserRoleService {
    private readonly projectUserRoleRepo;
    constructor(projectUserRoleRepo: AdmProjectUserRoleRepo);
    createProjectUserRole(createProjectUserRoleDto: any): Promise<any>;
    getAllProjectUsersRoles(filter?: any, options?: any): Promise<any[]>;
    getAllProjectUsersRoleWithSpecificFormate(projectId: number): Promise<{
        projectUserRoleId: any;
        userId: any;
        email: any;
        firstName: any;
        lastName: any;
        roleId: any;
        roleName: any;
    }[]>;
    getUsersByProjectAndRoleId(projectId: number, roleCode: string): Promise<{
        projectUserRoleId: any;
        userId: any;
        email: any;
        firstName: any;
        lastName: any;
    }[]>;
    deleteProjectUserRole(projectUserRoleId: number): Promise<void>;
    getProjectByUserId(userId: number, projectId?: number): Promise<any[]>;
}
