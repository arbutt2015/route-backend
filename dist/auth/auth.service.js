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
exports.AuthService = exports.USER_TYPE = void 0;
const common_1 = require("@nestjs/common");
const aws_cognito_service_1 = require("../aws/aws-cognito.service");
const adm_user_service_1 = require("../adm-user/adm-user.service");
const config_1 = require("@nestjs/config");
const adm_project_user_role_service_1 = require("../adm-project-user-role/adm-project-user-role.service");
const email_domain_checker__common_1 = require("../common/email-domain-checker..common");
const aws_ses_service_1 = require("../aws/aws-ses.service");
const gene_repo_service_1 = require("../gene-repo/gene-repo.service");
const fs = require("fs");
const path = require("path");
exports.USER_TYPE = {
    AGENCY_USER: 1,
    AGENCY_ADMIN: 2,
    SUPER_USER: 3,
};
let AuthService = class AuthService {
    constructor(cognitoService, configService, admUserService, projectUserRoleModule, sesService, geneRepoService) {
        this.cognitoService = cognitoService;
        this.configService = configService;
        this.admUserService = admUserService;
        this.projectUserRoleModule = projectUserRoleModule;
        this.sesService = sesService;
        this.geneRepoService = geneRepoService;
    }
    async sendEmailToAdmin(email, newEmail) {
        const subject = "New User Registered";
        const rootPath = path.join(process.cwd(), "static-data");
        const templatePath = path.join(rootPath, "email-template.html");
        if (!fs.existsSync(templatePath)) {
            throw new common_1.HttpException(`Email template not found at ${templatePath}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let template = fs.readFileSync(templatePath, "utf8");
        template = template.replace(/\[Email\]/g, newEmail);
        await this.sesService.sendEmail(email, subject, template, true);
    }
    async getAgencyByEmailDomain(email) {
        const domain = email.split("@")[1]?.split(".")[0];
        if (!domain)
            return null;
        const agencyRepo = await this.geneRepoService.getRepository("Agency");
        return await agencyRepo
            .createQueryBuilder("agency")
            .where("LOWER(agency.agencyName) = LOWER(:domain)", { domain })
            .getOne();
    }
    async findAgencyIdByEmailDomain(email) {
        const agency = await this.getAgencyByEmailDomain(email);
        return agency?.agencyId ?? null;
    }
    async createCognitoUser(email, firstName, middleInitial, lastName, companyName, title, phoneNumber, password, isVerified, isSdUser = false) {
        if ((0, email_domain_checker__common_1.isPublicEmailDomain)(email)) {
            throw new common_1.HttpException({
                message: "You cannot register using a public domain email address.",
                success: false,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.getUserByEmail({ where: { email } });
        if (user) {
            throw new common_1.HttpException({
                message: "User with this email already exists.",
                success: false,
            }, common_1.HttpStatus.BAD_REQUEST);
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
            userType: exports.USER_TYPE.AGENCY_USER,
        });
        const groupEmail = this.configService.get("NOTIFICATION_EMAIL_GROUP");
        if (groupEmail && process.env.NODE_ENV === "production") {
            await this.sendEmailToAdmin(groupEmail, email);
        }
        return res;
    }
    async confirmSignUp(confirmationCod, email) {
        return await this.cognitoService.confirmSignUp(confirmationCod, email);
    }
    async assignDemoProject(userId) {
        const demoProjectId = this.configService.get("DEMO_PROJECT_ID");
        if (!demoProjectId)
            return;
        await this.projectUserRoleModule.createProjectUserRole({
            projectId: demoProjectId,
            userId,
        });
    }
    async isUserActive(email) {
        const user = await this.admUserService.getUser({ where: { email } }, { relations: ["agency"] });
        return user;
    }
    async signIn(email, password) {
        const authResponse = await this.cognitoService.signIn(email, password);
        const { AccessToken, TokenType, RefreshToken, ExpiresIn } = authResponse;
        return {
            access_token: AccessToken,
            token_type: TokenType,
            ExpiresIn,
            refresh_token: RefreshToken,
        };
    }
    async forgotPassword(email) {
        return await this.cognitoService.forgotPassword(email);
    }
    async confirmForgotPassword(email, confirmationCode, newPassword) {
        return await this.cognitoService.confirmForgotPassword(email, confirmationCode, newPassword);
    }
    async getUserByEmail(filter, options) {
        return await this.admUserService.getUser(filter, options);
    }
    async resendConfirmationCode(email) {
        return await this.cognitoService.resendConfirmationCode(email);
    }
    async refreshToken(refreshToken) {
        try {
            return await this.cognitoService.refreshToken(refreshToken);
        }
        catch (error) {
            throw error;
        }
    }
    async changePassword(accessToken, previousPassword, proposedPassword, userId) {
        try {
            return await this.cognitoService.changePassword(accessToken, previousPassword, proposedPassword);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_cognito_service_1.AWSCognitoService,
        config_1.ConfigService,
        adm_user_service_1.AdmUserService,
        adm_project_user_role_service_1.AdmProjectUserRoleService,
        aws_ses_service_1.AWSSESService,
        gene_repo_service_1.GeneRepoService])
], AuthService);
//# sourceMappingURL=auth.service.js.map