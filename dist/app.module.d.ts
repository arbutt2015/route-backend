import "reflect-metadata";
import { MiddlewareConsumer, NestModule, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "./logger/logger.service";
import { ProjectService } from "./project/project.service";
import { AdmRoleService } from "./adm-role/adm-role.service";
export declare class AppModule implements NestModule, OnModuleInit {
    private logger;
    private configService;
    private admRoleService;
    private projectService;
    constructor(logger: LoggerService, configService: ConfigService, admRoleService: AdmRoleService, projectService: ProjectService);
    configure(consumer: MiddlewareConsumer): void;
    onModuleInit(): Promise<void>;
}
