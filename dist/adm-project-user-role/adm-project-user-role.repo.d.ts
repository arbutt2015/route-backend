import { GeneRepoService } from "src/gene-repo/gene-repo.service";
export declare class AdmProjectUserRoleRepo {
    private geneRepoService;
    private projectUserRoleRepository;
    constructor(geneRepoService: GeneRepoService);
    createProjectUserRole(createProjectUserRoleDto: any): Promise<any>;
    getAllProjectUsersRoles(filter?: any, options?: any): Promise<any[]>;
    getAllProjectUsersRole(filter: any, options: any): Promise<any[]>;
    deleteProjectUserRole(projectUserRoleId: number): Promise<void>;
}
