import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { LoggerService } from "src/logger/logger.service";
export declare class AWSCognitoService {
    private configService;
    private readonly loggerService;
    private clientId;
    private userPoolId;
    private clientSecret;
    private readonly cognito;
    constructor(configService: ConfigService, loggerService: LoggerService);
    generateSecrete(email: string, clientId: string, clientSecret: string): string;
    signUp(email: string, password: string, isVerified?: boolean): Promise<any>;
    confirmSignUp(confirmationCode: string, email: string): Promise<any>;
    resendConfirmationCode(email: string): Promise<void>;
    verifyEmail(username: string): Promise<{
        message: string;
    }>;
    signIn(email: string, password: string): Promise<AWS.CognitoIdentityServiceProvider.AuthenticationResultType>;
    forgotPassword(email: string): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.CognitoIdentityServiceProvider.ForgotPasswordResponse, AWS.AWSError>>;
    confirmForgotPassword(email: string, confirmationCode: string, newPassword: string): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.CognitoIdentityServiceProvider.ConfirmForgotPasswordResponse, AWS.AWSError>>;
    refreshToken(refreshToken: string): Promise<{
        access_token: string;
        ExpiresIn: number;
        IdToken: string;
        refresh_token: string;
        token_type: string;
    }>;
    changePassword(accessToken: string, previousPassword: string, proposedPassword: string): Promise<any>;
    deleteUser(username: string): Promise<any>;
}
