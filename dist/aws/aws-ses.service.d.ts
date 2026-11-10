import { ConfigService } from "@nestjs/config";
import { LoggerService } from "src/logger/logger.service";
export declare class AWSSESService {
    private configService;
    private loggerService;
    private ses;
    private senderEmail;
    constructor(configService: ConfigService, loggerService: LoggerService);
    sendEmail(toEmail: string, subject: string, body: string, isHtml?: boolean): Promise<void>;
}
