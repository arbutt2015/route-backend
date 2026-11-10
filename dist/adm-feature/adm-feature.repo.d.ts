import { GeneRepoService } from "src/gene-repo/gene-repo.service";
export declare class AdmFeatureRepo {
    private geneRepoService;
    private projectUserRepository;
    constructor(geneRepoService: GeneRepoService);
    getAllFeaturesByModuleId(filter?: any, option?: any): Promise<any[]>;
    getAllFeatures(filter?: any, option?: any): Promise<any[]>;
    createORUpdateFeature(feature: any): Promise<any>;
}
