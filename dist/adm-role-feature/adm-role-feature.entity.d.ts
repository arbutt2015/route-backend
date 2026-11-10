import { AdmFeature } from "../adm-feature/adm-feature.entity";
export declare class AdmRoleFeature {
    roleId: number;
    featureId: number;
    createPermission: boolean;
    readPermissions: boolean;
    updatePermission: boolean;
    deletePermissions: boolean;
    feature: AdmFeature;
}
