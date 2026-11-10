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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const fs = require("fs");
const path = require("path");
const safe_stable_stringify_1 = require("safe-stable-stringify");
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
let LoggerService = class LoggerService extends common_1.ConsoleLogger {
    constructor() {
        super();
        this.logDir = path.join(__dirname, "..", "..", "log");
        this.logger = (0, winston_1.createLogger)({
            level: "debug",
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.metadata({
                fillExcept: ["message", "level", "timestamp", "label", "stack"],
            }), ...(!IS_DEVELOPMENT
                ? [winston_1.format.uncolorize(), winston_1.format.json()]
                : [
                    winston_1.format.colorize({
                        all: true,
                        colors: {
                            debug: "green",
                            info: "blue",
                            warning: "yellow",
                            error: "red",
                        },
                    }),
                    winston_1.format.printf(({ timestamp, level, message, metadata, stack = "" }) => {
                        const extraData = Object.keys(metadata).length
                            ? (0, safe_stable_stringify_1.default)(metadata, null, 1)
                            : "";
                        return `${timestamp} [${level}]: ${message}\n${extraData}\n${stack}`;
                    }),
                ])),
            transports: [
                new winston_1.transports.Console({
                    level: "debug",
                }),
                new winston_1.transports.File({
                    filename: path.join(this.logDir, "development.log"),
                    level: "debug",
                }),
                IS_DEVELOPMENT
                    ? new winston_1.transports.File({
                        filename: path.join(this.logDir, "dev_errors.log"),
                        level: "error",
                    })
                    : new winston_1.transports.File({
                        filename: path.join(this.logDir, "production_errors.log"),
                        level: "error",
                    }),
            ],
        });
    }
    onModuleInit() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    error(message, trace, context) {
        const errorMessage = typeof message === "object" ? (0, safe_stable_stringify_1.default)(message) : message;
        this.logger.error(errorMessage, { trace, context });
        super.error(errorMessage, trace, context);
    }
    warn(message, context) {
        this.logger.warn(message, { context });
        super.warn(message, context);
    }
    log(message) {
        this.logger.info(message);
    }
    debug(message, context) {
        this.logger.debug(message, { context });
        super.debug(message, context);
    }
    verbose(message, context) {
        this.logger.verbose(message, { context });
        super.verbose(message, context);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map