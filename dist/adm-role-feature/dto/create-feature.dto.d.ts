export declare class FeatureDto {
    roleId: number;
    featureId: number;
    createPermission: boolean;
    readPermissions: boolean;
    updatePermission: boolean;
    deletePermissions: boolean;
}
export declare class CreateFeatureDto extends FeatureDto {
    features: FeatureDto[];
}
