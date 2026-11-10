"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const response_util_1 = require("../utils/response.util");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            const response = context.switchToHttp().getResponse();
            response.statusCode = data?.statusCode || response.statusCode;
            return (0, response_util_1.createSuccessResponse)(data?.data, response.locals.message || data?.message || "Success", data?.statusCode || response.statusCode || common_1.HttpStatus.OK, data?.success !== undefined ? data?.success : true);
        }), (0, operators_1.catchError)((err) => {
            const statusCode = err instanceof common_1.HttpException
                ? err.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
            const errorResponse = err instanceof common_1.HttpException ? err.getResponse() : null;
            const formattedErrorResponse = (0, response_util_1.createErrorResponse)(errorMessage, errorResponse, statusCode);
            return (0, rxjs_1.throwError)(() => formattedErrorResponse);
        }));
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map