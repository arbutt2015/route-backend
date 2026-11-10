import { GeneRepoService } from "src/gene-repo/gene-repo.service";
import { FeatureDto } from "./dto/create-feature.dto";
export declare class AdmRoleFeatureRepo {
    private geneRepoService;
    private admRoleFeatureRepository;
    constructor(geneRepoService: GeneRepoService);
    createRoleFeature(createRoleWithFeaturesDto: FeatureDto): Promise<any>;
    getAllRolesFeatures(): Promise<any[]>;
    getRolesAndFeaturesByIds(filter?: any, option?: any): Promise<any>;
    getRolesFeaturesByRoleId(filter?: any, option?: any): Promise<any[]>;
}
