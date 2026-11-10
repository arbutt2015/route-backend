import { ConfigService } from "@nestjs/config";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { LoggerService } from "src/logger/logger.service";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private admUserService;
    private readonly loggerService;
    constructor(configService: ConfigService, admUserService: AdmUserService, loggerService: LoggerService);
    validate(payload: any): Promise<any>;
}
export {};
