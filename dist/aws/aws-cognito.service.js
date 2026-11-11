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
exports.AWSCognitoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
const crypto = require("crypto");
const logger_service_1 = require("../logger/logger.service");
let AWSCognitoService = class AWSCognitoService {
    constructor(configService, loggerService) {
        this.configService = configService;
        this.loggerService = loggerService;
        AWS.config.update({
            region: this.configService.get("AWS_POOL_REGION"),
        });
        this.clientId = this.configService.get("AWS_COGNITO_CLIENT_ID");
        this.userPoolId = this.configService.get("AWS_POOL_USER_ID");
        this.clientSecret = this.configService.get("AWS_COGNITO_CLIENT_SECRET");
        this.cognito = new AWS.CognitoIdentityServiceProvider();
    }
    generateSecrete(email, clientId, clientSecret) {
        return crypto
            .createHmac("sha256", clientSecret)
            .update(email + clientId)
            .digest("base64");
    }
    async signUp(email, password, isVerified = false) {
        const secretHash = this.generateSecrete(email, this.clientId, this.clientSecret);
        const params = {
            ClientId: this.clientId,
            Username: email,
            Password: password,
            SecretHash: secretHash,
            ClientMetadata: {
                userType: isVerified ? "internal" : "external",
            },
        };
        const result = await this.cognito.signUp(params).promise();
        return result;
    }
    async confirmSignUp(confirmationCode, email) {
        const secretHash = await this.generateSecrete(email, this.clientId, this.clientSecret);
        const params = {
            ClientId: this.clientId,
            Username: email,
            ConfirmationCode: confirmationCode,
            SecretHash: secretHash,
        };
        await this.cognito.confirmSignUp(params).promise();
        this.loggerService.log("User confirmed successfully.");
        try {
            await this.verifyEmail(email);
            this.loggerService.log("User email verified successfully.");
        }
        catch (err) {
            this.loggerService.warn(`Email attribute verify skipped: ${err?.message}`);
        }
        return {
            message: "Email confirmation successful. You can now log in.",
        };
    }
    async resendConfirmationCode(email) {
        const secretHash = this.generateSecrete(email, this.clientId, this.clientSecret);
        const params = {
            ClientId: this.clientId,
            Username: email,
            SecretHash: secretHash,
        };
        await this.cognito.resendConfirmationCode(params).promise();
    }
    async verifyEmail(username) {
        const params = {
            UserPoolId: this.userPoolId,
            Username: username,
            UserAttributes: [
                {
                    Name: "email_verified",
                    Value: "true",
                },
            ],
        };
        await this.cognito.adminUpdateUserAttributes(params).promise();
        return { message: "Email verified successfully" };
    }
    async signIn(email, password) {
        const secretHash = await this.generateSecrete(email, this.clientId, this.clientSecret);
        const params = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: secretHash,
            },
        };
        const response = await this.cognito.initiateAuth(params).promise();
        return response.AuthenticationResult;
    }
    async forgotPassword(email) {
        const secretHash = await this.generateSecrete(email, this.clientId, this.clientSecret);
        const params = {
            ClientId: this.configService.get("AWS_COGNITO_CLIENT_ID"),
            SecretHash: secretHash,
            Username: email,
        };
        return await this.cognito.forgotPassword(params).promise();
    }
    async confirmForgotPassword(email, confirmationCode, newPassword) {
        const secretHash = await this.generateSecrete(email, this.clientId, this.clientSecret);
        const params = {
            ClientId: this.clientId,
            Username: email,
            SecretHash: secretHash,
            ConfirmationCode: confirmationCode,
            Password: newPassword,
        };
        return await this.cognito.confirmForgotPassword(params).promise();
    }
    async refreshToken(refreshToken) {
        const params = {
            AuthFlow: "REFRESH_TOKEN_AUTH",
            ClientId: this.clientId,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: this.clientSecret,
            },
        };
        try {
            const response = await this.cognito.initiateAuth(params).promise();
            return {
                access_token: response.AuthenticationResult?.AccessToken,
                ExpiresIn: response.AuthenticationResult?.ExpiresIn,
                IdToken: response.AuthenticationResult?.IdToken,
                refresh_token: response.AuthenticationResult?.RefreshToken,
                token_type: response.AuthenticationResult?.TokenType,
            };
        }
        catch (error) {
            throw new Error(`Error refreshing token: ${error.message}`);
        }
    }
    async changePassword(accessToken, previousPassword, proposedPassword) {
        const params = {
            AccessToken: accessToken,
            PreviousPassword: previousPassword,
            ProposedPassword: proposedPassword,
        };
        try {
            const response = await this.cognito.changePassword(params).promise();
            this.loggerService.log("Password changed successfully.");
            return response;
        }
        catch (error) {
            this.loggerService.error("Error changing password:", error);
            throw error;
        }
    }
    async deleteUser(username) {
        const params = {
            UserPoolId: this.userPoolId,
            Username: username,
        };
        try {
            await this.cognito.adminDeleteUser(params).promise();
            this.loggerService.log(`User ${username} deleted successfully.`);
            return { message: `User ${username} deleted successfully.` };
        }
        catch (error) {
            this.loggerService.error(`Error deleting user: ${error.message}`);
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
};
exports.AWSCognitoService = AWSCognitoService;
exports.AWSCognitoService = AWSCognitoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_service_1.LoggerService])
], AWSCognitoService);
//# sourceMappingURL=aws-cognito.service.js.map