import { AWSCognitoService } from "../aws/aws-cognito.service";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { ConfigService } from "@nestjs/config";
import { AdmProjectUserRoleService } from "../adm-project-user-role/adm-project-user-role.service";
import { AWSSESService } from "src/aws/aws-ses.service";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";
export declare const USER_TYPE: {
    readonly AGENCY_USER: 1;
    readonly AGENCY_ADMIN: 2;
    readonly SUPER_USER: 3;
};
export declare class AuthService {
    private readonly cognitoService;
    private configService;
    private readonly admUserService;
    private projectUserRoleModule;
    private sesService;
    private geneRepoService;
    constructor(cognitoService: AWSCognitoService, configService: ConfigService, admUserService: AdmUserService, projectUserRoleModule: AdmProjectUserRoleService, sesService: AWSSESService, geneRepoService: GeneRepoService);
    sendEmailToAdmin(email: string, newEmail: string): Promise<void>;
    getAgencyByEmailDomain(email: string): Promise<any>;
    private findAgencyIdByEmailDomain;
    createCognitoUser(email: string, firstName: string, middleInitial: string, lastName: string, companyName: string, title: string, phoneNumber: string, password: string, isVerified: boolean, isSdUser?: boolean): Promise<any>;
    confirmSignUp(confirmationCod: string, email: string): Promise<any>;
    assignDemoProject(userId: number): Promise<void>;
    isUserActive(email: string): Promise<any>;
    signIn(email: string, password: string): Promise<{
        access_token: string;
        token_type: string;
        ExpiresIn: number;
        refresh_token: string;
    }>;
    forgotPassword(email: string): Promise<import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/cognitoidentityserviceprovider").ForgotPasswordResponse, import("aws-sdk").AWSError>>;
    confirmForgotPassword(email: string, confirmationCode: string, newPassword: string): Promise<import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/cognitoidentityserviceprovider").ConfirmForgotPasswordResponse, import("aws-sdk").AWSError>>;
    getUserByEmail(filter?: any, options?: any): Promise<any>;
    resendConfirmationCode(email: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        ExpiresIn: number;
        IdToken: string;
        refresh_token: string;
        token_type: string;
    }>;
    changePassword(accessToken: string, previousPassword: string, proposedPassword: string, userId: number): Promise<any>;
}
