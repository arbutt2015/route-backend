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
exports.AWSSESService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
const logger_service_1 = require("../logger/logger.service");
let AWSSESService = class AWSSESService {
    constructor(configService, loggerService) {
        this.configService = configService;
        this.loggerService = loggerService;
        this.ses = new AWS.SES({
            accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
            secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
            region: this.configService.get("S3_BUCKET_REGION"),
        });
        this.senderEmail = this.configService.get("SES_SENDER_EMAIL");
    }
    async sendEmail(toEmail, subject, body, isHtml = true) {
        try {
            const params = {
                Source: this.senderEmail,
                Destination: {
                    ToAddresses: [toEmail],
                },
                Message: {
                    Subject: { Data: subject },
                    Body: isHtml ? { Html: { Data: body } } : { Text: { Data: body } },
                },
            };
            await this.ses.sendEmail(params).promise();
            this.loggerService.log(`✅ Email sent successfully to ${toEmail}`);
        }
        catch (error) {
            this.loggerService.error(`❌ Error sending email: ${error}`);
        }
    }
};
exports.AWSSESService = AWSSESService;
exports.AWSSESService = AWSSESService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_service_1.LoggerService])
], AWSSESService);
//# sourceMappingURL=aws-ses.service.js.map