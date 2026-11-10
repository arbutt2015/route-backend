import { Response } from "express";
export declare class ResponseHelperService {
    sendSuccessResponse(res: Response, message: string, data: any, statusCode?: number, success?: boolean): void;
    sendErrorResponse(res: Response, message: any, statusCode?: number, success?: boolean): void;
}
