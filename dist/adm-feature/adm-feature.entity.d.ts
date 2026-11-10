import { AdmModule } from "../adm-module/adm-module.entity";
import { AdmRoleFeature } from "../adm-role-feature/adm-role-feature.entity";
export declare class AdmFeature {
    featureId: number;
    featureName: string;
    featureUrl: string;
    sortOrder: number;
    module: AdmModule;
    admRoleFeatures: AdmRoleFeature[];
}
