import { AdmUserRepo } from "./adm-user.repo";
import { CreateUser } from "./interfaces/user.interface";
import { AWSCognitoService } from "src/aws/aws-cognito.service";
export declare class AdmUserService {
    private userRepo;
    private readonly cognitoService;
    constructor(userRepo: AdmUserRepo, cognitoService: AWSCognitoService);
    getAllUsers(filter?: any, options?: any): Promise<any[]>;
    getSdUsers(filter?: any, options?: any): Promise<any[]>;
    createUser(createUser: CreateUser & {
        isPasswordChangeRequired: boolean;
    }): Promise<void>;
    getUser(filter?: any, options?: any): Promise<any>;
    updateUserByWhereAndGetData(updateFilter: any, updateBody: any, option?: any): Promise<any[]>;
    deleteUser(userId: number): Promise<void>;
}
