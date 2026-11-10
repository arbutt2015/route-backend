import { AdmFeatureRepo } from "./adm-feature.repo";
export declare class AdmFeatureService {
    private readonly admFeatureRepo;
    constructor(admFeatureRepo: AdmFeatureRepo);
    getAllFeaturesByModuleId(moduleId: string): Promise<any[]>;
    getAllFeatures(filter?: any, options?: any): Promise<any[]>;
    createORUpdateFeature(dataObject: any): Promise<any>;
}
