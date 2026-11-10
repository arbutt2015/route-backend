import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { SignInDto } from "./dto/signIn.dto";
import { ConfirmSignUpDto } from "./dto/confirm-sign-up.dto";
import { ConfirmForgotPasswordDto } from "./dto/confirm-forgot-password.dto";
import { LoggerService } from "src/logger/logger.service";
import { Request } from "express";
import { AdmUser } from "../adm-user/adm-user.entity";
import { ChangePasswordDto } from "./dto/change-password.dto";
export declare class AuthController {
    private readonly authService;
    private readonly loggerService;
    constructor(authService: AuthService, loggerService: LoggerService);
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
        data: any[];
        statusCode: number;
        success?: undefined;
    } | {
        message: any;
        data: any[];
        statusCode: number;
        success: boolean;
    }>;
    signIn(signInDto: SignInDto): Promise<{
        message: string;
        data: {
            type: string;
        };
        statusCode: number;
        success: boolean;
    } | {
        success: boolean;
        message: string;
        statusCode: number;
        data: {
            user: {
                userId: any;
                email: any;
                firstName: any;
                middleInitial: any;
                lastName: any;
                usersAccess: any;
                createProjectAccess: any;
                assetsAccess: any;
                companyName: any;
                isPasswordChangeRequired: any;
            };
            access_token: string;
            token_type: string;
            ExpiresIn: number;
            refresh_token: string;
            type?: undefined;
        };
    } | {
        message: any;
        data: any[];
        statusCode: number;
        success: boolean;
    }>;
    refreshToken(refreshToken: string): Promise<{
        message: string;
        data: {
            access_token: string;
            ExpiresIn: number;
            IdToken: string;
            refresh_token: string;
            token_type: string;
        };
        statusCode: number;
    }>;
    checkDomain(email: string): Promise<{
        message: string;
        data: {
            shouldBeVerified: boolean;
        };
        success: boolean;
        statusCode?: undefined;
    } | {
        message: string;
        data: {
            shouldBeVerified: boolean;
        };
        statusCode: number;
        success: boolean;
    } | {
        message: string;
        data: {
            shouldBeVerified: boolean;
        };
        success?: undefined;
        statusCode?: undefined;
    }>;
    confirmSignUp(confirmSignUpDto: ConfirmSignUpDto): Promise<{
        message: string;
        statusCode: number;
        data: any;
        success?: undefined;
    } | {
        message: string;
        statusCode: number;
        data: any[];
        success: boolean;
    }>;
    assignDemoProject(data: any): Promise<{
        message: string;
        statusCode: number;
        data: any[];
        success?: undefined;
    } | {
        message: string;
        statusCode: number;
        data: any[];
        success: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        data: any[];
        statusCode: number;
        success: boolean;
    } | {
        message: string;
        data: any[];
        statusCode?: undefined;
        success?: undefined;
    }>;
    confirmForgotPassword(confirmForgotPasswordDto: ConfirmForgotPasswordDto): Promise<{
        message: string;
        data: import("aws-sdk/lib/request").PromiseResult<import("aws-sdk/clients/cognitoidentityserviceprovider").ConfirmForgotPasswordResponse, import("aws-sdk").AWSError>;
        statusCode: number;
        success?: undefined;
    } | {
        message: string;
        statusCode: number;
        data: any[];
        success: boolean;
    }>;
    resendConfirmationCode(body: {
        email: string;
    }): Promise<{
        message: string;
        data: any[];
    }>;
    changePassword(req: Request & {
        user: AdmUser;
    }, body: ChangePasswordDto): Promise<{
        message: string;
        data: any;
    }>;
}
