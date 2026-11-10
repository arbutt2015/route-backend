import { AdmUserService } from "./adm-user.service";
import { LoggerService } from "src/logger/logger.service";
export declare class AdmUserController {
    private readonly userService;
    private readonly loggerService;
    constructor(userService: AdmUserService, loggerService: LoggerService);
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
