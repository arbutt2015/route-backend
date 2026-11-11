export interface CreateUser {
    email: string;
    firstName: string;
    lastName: string;
    title?: string;
    phoneNumber?: string;
    isActive?: boolean;
    cognitoId?: string;
    agencyId?: number;
    userType?: number;
}
