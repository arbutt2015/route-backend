"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const sendSuccessResponse = (res, message, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        error: {
            message,
        },
    });
};
exports.sendErrorResponse = sendErrorResponse;
//# sourceMappingURL=responseHelper.common.js.map