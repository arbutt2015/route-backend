"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelperService = void 0;
const common_1 = require("@nestjs/common");
let ResponseHelperService = class ResponseHelperService {
    sendSuccessResponse(res, message, data, statusCode = common_1.HttpStatus.OK, success = true) {
        res.status(statusCode).json({
            success,
            message,
            data,
        });
    }
    sendErrorResponse(res, message, statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR, success = false) {
        res.status(statusCode).json({
            success,
            error: {
                message,
            },
        });
    }
};
exports.ResponseHelperService = ResponseHelperService;
exports.ResponseHelperService = ResponseHelperService = __decorate([
    (0, common_1.Injectable)()
], ResponseHelperService);
//# sourceMappingURL=response-helper.service.js.map