import { GeneRepoService } from "src/gene-repo/gene-repo.service";
export declare class AdmModuleRepo {
    private geneRepoService;
    private admModuleRepository;
    constructor(geneRepoService: GeneRepoService);
    getAllModules(filter?: any, options?: any): Promise<any[]>;
    createORUpdateModule(createModuleDto: any): Promise<any>;
}
