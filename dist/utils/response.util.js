"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createSuccessResponse = void 0;
const createSuccessResponse = (data, message = "Success", statusCode = 200, success = false) => ({
    statusCode,
    success,
    message,
    data,
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (message, error = null, statusCode = 500) => ({
    statusCode,
    success: false,
    message,
    error,
});
exports.createErrorResponse = createErrorResponse;
//# sourceMappingURL=response.util.js.map