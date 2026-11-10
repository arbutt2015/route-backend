import { AdmUserRepo } from "./adm-user.repo";
import { CreateUser } from "./interfaces/user.interface";
import { AWSCognitoService } from "src/aws/aws-cognito.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
export declare class AdmUserService {
    private userRepo;
    private readonly cognitoService;
    constructor(userRepo: AdmUserRepo, cognitoService: AWSCognitoService);
    getProfile(userId: number): Promise<{
        userId: number;
        email: string;
        firstName: string;
        middleInitial: string;
        lastName: string;
        companyName: string;
        title: string;
        phoneNumber: string;
        isPasswordChangeRequired: boolean;
    }>;
    updateProfile(userId: number, profile: UpdateProfileDto): Promise<{
        userId: number;
        email: string;
        firstName: string;
        middleInitial: string;
        lastName: string;
        companyName: string;
        title: string;
        phoneNumber: string;
        isPasswordChangeRequired: boolean;
    }>;
    private toProfile;
    getAllUsers(filter?: any, options?: any): Promise<any[]>;
    getSdUsers(filter?: any, options?: any): Promise<any[]>;
    createUser(createUser: CreateUser & {
        isPasswordChangeRequired: boolean;
    }): Promise<void>;
    getUser(filter?: any, options?: any): Promise<any>;
    updateUserByWhereAndGetData(updateFilter: any, updateBody: any, option?: any): Promise<any[]>;
    deleteUser(userId: number): Promise<void>;
}
