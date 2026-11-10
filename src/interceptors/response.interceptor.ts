import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  createSuccessResponse,
  createErrorResponse,
  ApiResponse,
} from "../utils/response.util";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      // Handle successful responses
      map((data) => {
        const response = context.switchToHttp().getResponse();
        response.statusCode = data?.statusCode || response.statusCode;
        return createSuccessResponse(
          data?.data,
          response.locals.message || data?.message || "Success",
          data?.statusCode || response.statusCode || HttpStatus.OK,
          data?.success !== undefined ? data?.success : true,
        );
      }),
      // Handle errors and exceptions
      catchError((err) => {
        const statusCode =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorMessage =
          err instanceof Error ? err.message : "Internal Server Error";
        const errorResponse =
          err instanceof HttpException ? err.getResponse() : null;
        // Create the error response
        const formattedErrorResponse = createErrorResponse(
          errorMessage,
          errorResponse,
          statusCode,
        );
        return throwError(() => formattedErrorResponse);
      }),
    );
  }
}
