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
exports.LoggingService = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const fs = require("fs");
const path = require("path");
const safe_stable_stringify_1 = require("safe-stable-stringify");
const IS_DEVELOPMENT = true;
let LoggingService = class LoggingService extends common_1.ConsoleLogger {
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
                            warning: "amber",
                            error: "red",
                        },
                    }),
                    winston_1.format.printf(({ timestamp, level, message, metadata, stack = "" }) => {
                        const extraData = Object.keys(metadata).length
                            ? (0, safe_stable_stringify_1.default)(metadata, null, 1)
                            : "";
                        return [`${timestamp} [${level}]: ${message}`, extraData, stack]
                            .filter(Boolean)
                            .join("\n");
                    }),
                ])),
            transports: [
                new winston_1.transports.Console({
                    level: "debug",
                }),
                new winston_1.transports.File({
                    filename: path.join(__dirname, "..", "..", "log", "development.log"),
                    level: "debug",
                }),
                new winston_1.transports.File({
                    filename: path.join(__dirname, "..", "..", "log", "dev_errors.log"),
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
        this.logger.error(message, { trace, context });
        super.error(message, trace, context);
    }
    warn(message, context) {
        this.logger.warn(message);
        super.warn(message, context);
    }
    log(message) {
        this.logger.info(message);
    }
    debug(message, context) {
        this.logger.debug(message);
        super.debug(message, context);
    }
    verbose(message, context) {
        this.logger.verbose(message);
        super.verbose(message, context);
    }
};
exports.LoggingService = LoggingService;
exports.LoggingService = LoggingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggingService);
//# sourceMappingURL=graylog.common.js.map