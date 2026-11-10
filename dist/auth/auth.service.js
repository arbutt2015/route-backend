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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const aws_cognito_service_1 = require("../aws/aws-cognito.service");
const adm_user_service_1 = require("../adm-user/adm-user.service");
const config_1 = require("@nestjs/config");
const adm_project_user_role_service_1 = require("../adm-project-user-role/adm-project-user-role.service");
const email_domain_checker__common_1 = require("../common/email-domain-checker..common");
const aws_ses_service_1 = require("../aws/aws-ses.service");
const fs = require("fs");
const path = require("path");
let AuthService = class AuthService {
    constructor(cognitoService, configService, admUserService, projectUserRoleModule, sesService) {
        this.cognitoService = cognitoService;
        this.configService = configService;
        this.admUserService = admUserService;
        this.projectUserRoleModule = projectUserRoleModule;
        this.sesService = sesService;
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
    async isCodeUnique(collectorCode) {
        const existingCode = await this.admUserService.getUser({
            where: { collectorCode },
        });
        return !existingCode;
    }
    async generateCollectorCode(length) {
        let isUnique = false;
        let newCode;
        while (!isUnique) {
            newCode = this.generateRandomCode(length);
            isUnique = await this.isCodeUnique(newCode);
        }
        return newCode;
    }
    generateRandomCode(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }
    async confirmSignUp(confirmationCod, email) {
        const result = await this.cognitoService.confirmSignUp(confirmationCod, email);
        await this.admUserService.updateUserByWhereAndGetData({ where: { email } }, {
            isVerified: true,
        }, { where: { email } });
        return result;
    }
    async assignDemoProject(userId) {
        await this.projectUserRoleModule.createProjectUserRole({
            project: this.configService.get("DEMO_PROJECT_ID"),
            user: userId,
            role: this.configService.get("VIEWER_DEFAULT_ROLE_ID"),
        });
    }
    async isUserActive(email) {
        const user = await this.admUserService.getUser({ where: { email } });
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
            const response = await this.cognitoService.changePassword(accessToken, previousPassword, proposedPassword);
            if (userId) {
                await this.admUserService.updateUserByWhereAndGetData({ where: { userId } }, {
                    isPasswordChangeRequired: false,
                });
            }
            return response;
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
        aws_ses_service_1.AWSSESService])
], AuthService);
//# sourceMappingURL=auth.service.js.map