import { AdmUserService } from "./adm-user.service";
import { LoggerService } from "src/logger/logger.service";
import { Request } from "express";
import { AdmUser } from "./adm-user.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
export declare class AdmUserController {
    private readonly userService;
    private readonly loggerService;
    constructor(userService: AdmUserService, loggerService: LoggerService);
    getProfile(req: Request & {
        user: AdmUser;
    }): Promise<{
        message: string;
        data: {
            userId: number;
            email: string;
            firstName: string;
            middleInitial: string;
            lastName: string;
            companyName: string;
            title: string;
            phoneNumber: string;
            isPasswordChangeRequired: boolean;
        };
    }>;
    updateProfile(req: Request & {
        user: AdmUser;
    }, profile: UpdateProfileDto): Promise<{
        message: string;
        data: {
            userId: number;
            email: string;
            firstName: string;
            middleInitial: string;
            lastName: string;
            companyName: string;
            title: string;
            phoneNumber: string;
            isPasswordChangeRequired: boolean;
        };
    }>;
    getAllUsers(): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    getSdUsers(): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    getUserById(userId: number): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    updateUserById(userUpdateDto: any): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    deleteUser(userId: number): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
}
