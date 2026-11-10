"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const graylog_common_1 = require("./graylog.common");
let LoggerMiddleware = class LoggerMiddleware {
    constructor() {
        this.logger = new graylog_common_1.LoggingService();
    }
    use(req, res, next) {
        const statusCode = res.statusCode;
        if (statusCode >= 200 && statusCode < 300) {
            this.logger.log(`[${new Date().toLocaleString()}] Request: ${req.method} ${req.originalUrl}`);
        }
        else if (statusCode >= 400 && statusCode < 500) {
            this.logger.warn(`[${new Date().toLocaleString()}] Request: ${req.method} ${req.originalUrl}`);
        }
        else {
            this.logger.error(`[${new Date().toLocaleString()}] Request: ${req.method} ${req.originalUrl}`);
        }
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerMiddleware);
//# sourceMappingURL=logger.middleware.common.js.map