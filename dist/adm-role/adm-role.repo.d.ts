import { GeneRepoService } from "src/gene-repo/gene-repo.service";
export declare class AdmRoleRepo {
    private geneRepoService;
    private admRoleRepository;
    constructor(geneRepoService: GeneRepoService);
    createRole(roleData: any): Promise<any>;
    getAllRoles(filter?: any, options?: any): Promise<any[]>;
    deleteRole(filter?: any): Promise<void>;
}
