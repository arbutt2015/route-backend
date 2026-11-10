import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { LoggerService } from "src/logger/logger.service";

@Injectable()
export class AWSSESService {
  private ses: AWS.SES;
  private senderEmail: string;

  constructor(
    private configService: ConfigService,
    private loggerService: LoggerService,
  ) {
    this.ses = new AWS.SES({
      accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
      region: this.configService.get("S3_BUCKET_REGION"),
    });

    this.senderEmail = this.configService.get("SES_SENDER_EMAIL");
  }

  /**
   * Send an email using AWS SES
   * @param {string} toEmail - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} body - Email body (HTML or plain text)
   * @param {boolean} isHtml - Set to true for HTML email, false for plain text
   */
  async sendEmail(
    toEmail: string,
    subject: string,
    body: string,
    isHtml: boolean = true,
  ): Promise<void> {
    try {
      const params: AWS.SES.SendEmailRequest = {
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
    } catch (error) {
      this.loggerService.error(`❌ Error sending email: ${error}`);
    }
  }
}
