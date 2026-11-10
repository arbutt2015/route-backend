export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data?: T;
  error?: string | object;
}

export const createSuccessResponse = <T>(
  data: T,
  message: string = "Success",
  statusCode: number = 200,
  success: boolean = false,
): ApiResponse<T> => ({
  statusCode,
  success,
  message,
  data,
});

export const createErrorResponse = (
  message: string,
  error: string | object = null,
  statusCode: number = 500,
): ApiResponse<null> => ({
  statusCode,
  success: false,
  message,
  error,
});
