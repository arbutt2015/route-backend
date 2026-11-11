import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AWSCognitoService } from "../aws/aws-cognito.service";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { ConfigService } from "@nestjs/config";
import { AdmProjectUserRoleService } from "../adm-project-user-role/adm-project-user-role.service";
import { isPublicEmailDomain } from "src/common/email-domain-checker..common";
import { AWSSESService } from "src/aws/aws-ses.service";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";
import * as fs from "fs";
import * as path from "path";

export const USER_TYPE = {
  AGENCY_USER: 1,
  AGENCY_ADMIN: 2,
  SUPER_USER: 3,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly cognitoService: AWSCognitoService,
    private configService: ConfigService,
    private readonly admUserService: AdmUserService,
    private projectUserRoleModule: AdmProjectUserRoleService,
    private sesService: AWSSESService,
    private geneRepoService: GeneRepoService,
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

  async getAgencyByEmailDomain(email: string) {
    const domain = email.split("@")[1]?.split(".")[0];
    if (!domain) return null;
    const agencyRepo = await this.geneRepoService.getRepository("Agency");
    return await agencyRepo
      .createQueryBuilder("agency")
      .where("LOWER(agency.agencyName) = LOWER(:domain)", { domain })
      .getOne();
  }

  private async findAgencyIdByEmailDomain(email: string) {
    const agency = await this.getAgencyByEmailDomain(email);
    return agency?.agencyId ?? null;
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
    const agencyId = await this.findAgencyIdByEmailDomain(email);
    await this.admUserService.createUser({
      email,
      firstName,
      lastName,
      title,
      phoneNumber,
      isActive: true,
      cognitoId: res?.UserSub,
      agencyId,
      userType: USER_TYPE.AGENCY_USER,
    });

    const groupEmail = this.configService.get("NOTIFICATION_EMAIL_GROUP");

    if (groupEmail && process.env.NODE_ENV === "production") {
      await this.sendEmailToAdmin(groupEmail, email);
    }

    return res;
  }

  async confirmSignUp(confirmationCod: string, email: string) {
    return await this.cognitoService.confirmSignUp(confirmationCod, email);
  }
  async assignDemoProject(userId: number) {
    const demoProjectId = this.configService.get<number>("DEMO_PROJECT_ID");
    if (!demoProjectId) return;
    await this.projectUserRoleModule.createProjectUserRole({
      projectId: demoProjectId,
      userId,
    });
  }

  async isUserActive(email: string) {
    const user = await this.admUserService.getUser(
      { where: { email } },
      { relations: ["agency"] },
    );
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
      return await this.cognitoService.changePassword(
        accessToken,
        previousPassword,
        proposedPassword,
      );
    } catch (error) {
      throw error;
    }
  }
}
