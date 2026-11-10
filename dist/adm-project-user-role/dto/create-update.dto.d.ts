export declare class CreateProjectUserRoleDto {
    projectUserRoleId?: string;
    projectId: string;
    userId: string;
    roleId: string;
    cognitoId?: string;
}
export declare class GetUsersByProjectAndRoleIdDto {
    roleCode: string;
    projectId: number;
}
