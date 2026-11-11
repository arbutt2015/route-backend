import { AdmProjectUserRoleRepo } from "./adm-project-user-role.repo";
export declare class AdmProjectUserRoleService {
    private readonly projectUserRoleRepo;
    constructor(projectUserRoleRepo: AdmProjectUserRoleRepo);
    createProjectUserRole(createProjectUserRoleDto: {
        projectId: number;
        userId: number;
    }): Promise<any>;
    getAllProjectUsersRoles(filter?: any, options?: any): Promise<any[]>;
    getAllProjectUsersRoleWithSpecificFormate(projectId: number): Promise<{
        projectId: any;
        userId: any;
        email: any;
        firstName: any;
        lastName: any;
    }[]>;
    getUsersByProject(projectId: number): Promise<{
        projectId: any;
        userId: any;
        email: any;
        firstName: any;
        lastName: any;
    }[]>;
    deleteProjectUserRole(projectId: number, userId: number): Promise<void>;
    getProjectByUserId(userId: number, projectId?: number): Promise<any[]>;
}
