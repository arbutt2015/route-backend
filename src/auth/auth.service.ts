import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AWSCognitoService } from "../aws/aws-cognito.service";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { ConfigService } from "@nestjs/config";
import { AdmProjectUserRoleService } from "../adm-project-user-role/adm-project-user-role.service";
import { isPublicEmailDomain } from "src/common/email-domain-checker..common";
import { AWSSESService } from "src/aws/aws-ses.service";
import * as fs from "fs";
import * as path from "path";
@Injectable()
export class AuthService {
  constructor(
    private readonly cognitoService: AWSCognitoService,
    private configService: ConfigService,
    private readonly admUserService: AdmUserService,
    private projectUserRoleModule: AdmProjectUserRoleService,
    private sesService: AWSSESService,
  ) {}
  async sendEmailToAdmin(email: string, newEmail: string) {
    const subject = "New User Registered";

    const rootPath = path.join(process.cwd(), "static-data");
    const templatePath = path.join(rootPath, "email-template.html");

    if (!fs.existsSync(templatePath)) {
      throw new HttpException(
        `Email template not found at ${templatePath}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let template = fs.readFileSync(templatePath, "utf8");

    template = template.replace(/\[Email\]/g, newEmail);

    await this.sesService.sendEmail(email, subject, template, true);
  }

  async createCognitoUser(
    email: string,
    firstName: string,
    middleInitial: string,
    lastName: string,
    companyName: string,
    title: string,
    phoneNumber: string,
    password: string,
    isVerified: boolean,
    isSdUser: boolean = false,
  ) {
    if (isPublicEmailDomain(email)) {
      throw new HttpException(
        {
          message: "You cannot register using a public domain email address.",
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getUserByEmail({ where: { email } });
    if (user) {
      throw new HttpException(
        {
          message: "User with this email already exists.",
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const res = await this.cognitoService.signUp(email, password, isVerified);
    const collectorCode = await this.generateCollectorCode(5);
    await this.admUserService.createUser({
      email,
      firstName,
      middleInitial,
      lastName,
      companyName,
      title,
      phoneNumber,
      isActive: true,
      isVerified,
      cognitoId: res?.UserSub,
      collectorCode,
      isPasswordChangeRequired: isVerified,
      isSdUser,
    });

    const groupEmail = this.configService.get("NOTIFICATION_EMAIL_GROUP");

    if (groupEmail && process.env.NODE_ENV === "production") {
      await this.sendEmailToAdmin(groupEmail, email);
    }

    return res;
  }
  private async isCodeUnique(collectorCode: string): Promise<boolean> {
    const existingCode = await this.admUserService.getUser({
      where: { collectorCode },
    });
    return !existingCode;
  }

  async generateCollectorCode(length: number): Promise<string> {
    let isUnique = false;
    let newCode: string;

    while (!isUnique) {
      newCode = this.generateRandomCode(length);
      isUnique = await this.isCodeUnique(newCode);
    }

    return newCode;
  }
  private generateRandomCode(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  async confirmSignUp(confirmationCod: string, email: string) {
    const result = await this.cognitoService.confirmSignUp(
      confirmationCod,
      email,
    );
    await this.admUserService.updateUserByWhereAndGetData(
      { where: { email } },
      {
        isVerified: true,
      },
      { where: { email } },
    );

    return result;
  }
  async assignDemoProject(userId: number) {
    await this.projectUserRoleModule.createProjectUserRole({
      project: this.configService.get("DEMO_PROJECT_ID"),
      user: userId,
      role: this.configService.get("VIEWER_DEFAULT_ROLE_ID"),
    });
  }

  async isUserActive(email: string) {
    const user = await this.admUserService.getUser({ where: { email } });
    return user;
  }
  async signIn(email: string, password: string) {
    const authResponse = await this.cognitoService.signIn(email, password);
    const { AccessToken, TokenType, RefreshToken, ExpiresIn } = authResponse;
    return {
      access_token: AccessToken,
      token_type: TokenType,
      ExpiresIn,
      refresh_token: RefreshToken,
    };
  }

  async forgotPassword(email: string) {
    return await this.cognitoService.forgotPassword(email);
  }

  async confirmForgotPassword(
    email: string,
    confirmationCode: string,
    newPassword: string,
  ) {
    return await this.cognitoService.confirmForgotPassword(
      email,
      confirmationCode,
      newPassword,
    );
  }
  async getUserByEmail(filter?: any, options?: any) {
    return await this.admUserService.getUser(filter, options);
  }

  async resendConfirmationCode(email: string) {
    return await this.cognitoService.resendConfirmationCode(email);
  }

  async refreshToken(refreshToken: string) {
    try {
      return await this.cognitoService.refreshToken(refreshToken);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    accessToken: string,
    previousPassword: string,
    proposedPassword: string,
    userId: number,
  ): Promise<any> {
    try {
      const response = await this.cognitoService.changePassword(
        accessToken,
        previousPassword,
        proposedPassword,
      );
      if (userId) {
        await this.admUserService.updateUserByWhereAndGetData(
          { where: { userId } },
          {
            isPasswordChangeRequired: false,
          },
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
