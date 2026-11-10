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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signUp_dto_1 = require("./dto/signUp.dto");
const signIn_dto_1 = require("./dto/signIn.dto");
const confirm_sign_up_dto_1 = require("./dto/confirm-sign-up.dto");
const confirm_forgot_password_dto_1 = require("./dto/confirm-forgot-password.dto");
const email_domain_checker__common_1 = require("../common/email-domain-checker..common");
const logger_service_1 = require("../logger/logger.service");
const skip_auth_decorator_1 = require("./skip-auth.decorator");
const skip_role_guard_decorator_1 = require("./decorator/skip-role.guard.decorator");
let AuthController = class AuthController {
    constructor(authService, loggerService) {
        this.authService = authService;
        this.loggerService = loggerService;
    }
    async signUp(signUpDto) {
        try {
            await this.authService.createCognitoUser(signUpDto.email, signUpDto.firstName, signUpDto.middleInitial, signUpDto.lastName, signUpDto.companyName, signUpDto.title, signUpDto.phoneNumber, signUpDto.password, signUpDto.isVerified, signUpDto.isSdUser);
            return {
                message: "User created",
                data: [],
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            if (error.code === "UsernameExistsException") {
                error.message = "Email already exists";
            }
            else if (error.code === "InvalidPasswordException") {
                error.message =
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
            }
            else if (error.code === "InvalidParameterException") {
                error.message =
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
            }
            else if (error.code === "InvalidEmailException") {
                error.message = "Invalid email address";
            }
            else if (error.code === "InvalidPhoneException") {
                error.message = "Invalid phone number";
            }
            else {
                throw new Error(error.message);
            }
            return {
                message: error.message,
                data: [],
                statusCode: 400,
                success: false,
            };
        }
    }
    async signIn(signInDto) {
        try {
            const user = await this.authService.isUserActive(signInDto.email);
            if (!user) {
                return {
                    statusCode: 404,
                    data: null,
                    success: false,
                    message: "No user found.",
                };
            }
            if (user && !user.isActive) {
                return {
                    statusCode: 403,
                    data: [],
                    success: false,
                    message: "Your account is inactive",
                };
            }
            if (user?.isVerified === false) {
                return {
                    message: "notConfirmed",
                    data: { type: "UserNotConfirmedException" },
                    statusCode: 201,
                    success: false,
                };
            }
            const response = await this.authService.signIn(signInDto.email, signInDto.password);
            return {
                success: true,
                message: "Sign in successful",
                statusCode: 200,
                data: {
                    ...response,
                    user: {
                        userId: user.userId,
                        email: user.email,
                        firstName: user.firstName,
                        middleInitial: user.middleInitial,
                        lastName: user.lastName,
                        usersAccess: user.usersAccess,
                        createProjectAccess: user.createProjectAccess,
                        assetsAccess: user.assetsAccess,
                        companyName: user.companyName,
                        isPasswordChangeRequired: user.isPasswordChangeRequired,
                    },
                },
            };
        }
        catch (error) {
            this.loggerService.error(error);
            if (error.code === "NotAuthorizedException") {
                error.message = "The login credentials are invalid. Please try again";
            }
            else if (error.code === "UserNotConfirmedException") {
                error.message = "User not confirmed";
            }
            else {
                throw new Error(error.message);
            }
            return {
                message: error.message,
                data: [],
                statusCode: 400,
                success: false,
            };
        }
    }
    async refreshToken(refreshToken) {
        try {
            const sendRefreshToken = await this.authService.refreshToken(refreshToken);
            return {
                message: "New Refresh Token",
                data: sendRefreshToken,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw new Error(error.message);
        }
    }
    async checkDomain(email) {
        try {
            const user = await this.authService.getUserByEmail({ where: { email } }, {
                select: ["isVerified"],
            });
            if (user) {
                if (user?.isVerified) {
                    return {
                        message: "The email address is already registered.",
                        data: null,
                        success: false,
                    };
                }
                return {
                    message: "User is not verified.",
                    data: { shouldBeVerified: true },
                    success: true,
                };
            }
            if ((0, email_domain_checker__common_1.isPublicEmailDomain)(email)) {
                return {
                    message: "You cannot register using a public domain email address.",
                    data: { shouldBeVerified: false },
                    statusCode: 400,
                    success: false,
                };
            }
            return {
                message: "",
                data: { shouldBeVerified: false },
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw new Error(error.message);
        }
    }
    async confirmSignUp(confirmSignUpDto) {
        let messageFail = "";
        try {
            const data = await this.authService.confirmSignUp(confirmSignUpDto.confirmationCode, confirmSignUpDto.email);
            return {
                message: "",
                statusCode: 201,
                data,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            if (error.code === "CodeMismatchException") {
                messageFail = "Invalid verification code.";
            }
            else if (error.code === "ExpiredCodeException") {
                messageFail =
                    "The verification code has expired. Please request a new one.";
            }
            else if (error.code === "NotAuthorizedException") {
                messageFail = "This email address is already verified.";
            }
            else {
                throw new Error(error.message);
            }
            return {
                message: messageFail,
                statusCode: 400,
                data: [],
                success: false,
            };
        }
    }
    async assignDemoProject(data) {
        try {
            await this.authService.assignDemoProject(data.userId);
            return {
                message: "",
                statusCode: 201,
                data: [],
            };
        }
        catch (error) {
            return {
                message: `${error}`,
                statusCode: 400,
                data: [],
                success: false,
            };
        }
    }
    async forgotPassword(email) {
        try {
            const data = await this.authService.getUserByEmail({ where: { email } });
            if (!data) {
                return {
                    message: "Email not exist",
                    data: [],
                    statusCode: 201,
                    success: false,
                };
            }
            if (data?.isVerified === false) {
                return {
                    message: "Your email is not verified. Please verify your email first.",
                    data: [],
                    statusCode: 201,
                    success: false,
                };
            }
            await this.authService.forgotPassword(email);
            return {
                message: "Verification code sent, check your email",
                data: [],
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw new Error(error.message);
        }
    }
    async confirmForgotPassword(confirmForgotPasswordDto) {
        try {
            const data = await this.authService.confirmForgotPassword(confirmForgotPasswordDto.email, confirmForgotPasswordDto.confirmationCode, confirmForgotPasswordDto.newPassword);
            return {
                message: "Password changed successfully",
                data,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            if (error.code === "CodeMismatchException") {
                return {
                    message: "Invalid verification code.",
                    statusCode: 400,
                    data: [],
                    success: false,
                };
            }
            throw new Error(error.message);
        }
    }
    async resendConfirmationCode(body) {
        try {
            await this.authService.resendConfirmationCode(body.email);
            return {
                message: "Verification code resent. Please check your email.",
                data: [],
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw new Error(error.message);
        }
    }
    async changePassword(req, refreshToken, previousPassword, proposedPassword, userId) {
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return {
                    message: "Authorization token missing or malformed",
                    statusCode: 400,
                    data: [],
                    success: false,
                };
            }
            const token = authHeader.split(" ")[1];
            const data = await this.authService.changePassword(token, previousPassword, proposedPassword, userId);
            return {
                message: "Password changed successfully",
                data: data,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            if (error.code === "NotAuthorizedException") {
                return {
                    message: "Current password is Invalid",
                    data: [],
                    statusCode: 400,
                    success: false,
                };
            }
            throw new Error(error.message);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signUp_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)("signin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_dto_1.SignInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)("refresh-token"),
    __param(0, (0, common_1.Body)("refreshToken")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)("check-domain"),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkDomain", null);
__decorate([
    (0, common_1.Post)("confirm-sign-up"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_sign_up_dto_1.ConfirmSignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmSignUp", null);
__decorate([
    (0, common_1.Post)("assign-demo-project"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "assignDemoProject", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Put)("confirm-forgot-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_forgot_password_dto_1.ConfirmForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmForgotPassword", null);
__decorate([
    (0, common_1.Post)("resend-code"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendConfirmationCode", null);
__decorate([
    (0, common_1.Put)("change-password"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("refreshToken")),
    __param(2, (0, common_1.Body)("previousPassword")),
    __param(3, (0, common_1.Body)("proposedPassword")),
    __param(4, (0, common_1.Body)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, skip_auth_decorator_1.SkipAuth)(),
    (0, skip_role_guard_decorator_1.SkipRolesGuard)(),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        logger_service_1.LoggerService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map