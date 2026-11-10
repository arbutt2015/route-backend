export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    success: boolean;
    data?: T;
    error?: string | object;
}
export declare const createSuccessResponse: <T>(data: T, message?: string, statusCode?: number, success?: boolean) => ApiResponse<T>;
export declare const createErrorResponse: (message: string, error?: string | object, statusCode?: number) => ApiResponse<null>;
