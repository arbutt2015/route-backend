import { ConsoleLogger, OnModuleInit } from "@nestjs/common";
export declare class LoggerService extends ConsoleLogger implements OnModuleInit {
    private readonly logDir;
    private readonly logger;
    constructor();
    onModuleInit(): void;
    error(message: any, trace?: string, context?: string): void;
    warn(message: any, context?: string): void;
    log(message: any): void;
    debug(message: any, context?: string): void;
    verbose(message: any, context?: string): void;
}
