import {
  Controller,
  Post,
  Body,
  Put,
  Req,
  SetMetadata,
  ValidationPipe,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService, USER_TYPE } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { SignInDto } from "./dto/signIn.dto";
import { ConfirmSignUpDto } from "./dto/confirm-sign-up.dto";
import { ConfirmForgotPasswordDto } from "./dto/confirm-forgot-password.dto";
import { isPublicEmailDomain } from "../common/email-domain-checker..common";
import { LoggerService } from "src/logger/logger.service";
import { SkipAuth, SKIP_AUTH_KEY } from "./skip-auth.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Request } from "express";
import { AdmUser } from "../adm-user/adm-user.entity";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { SkipRolesGuard } from "./decorator/skip-role.guard.decorator";

@SkipAuth()
@SkipRolesGuard()
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post("signup")
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      await this.authService.createCognitoUser(
        signUpDto.email,
        signUpDto.firstName,
        signUpDto.middleInitial,
        signUpDto.lastName,
        signUpDto.companyName,
        signUpDto.title,
        signUpDto.phoneNumber,
        signUpDto.password,
        signUpDto.isVerified,
        signUpDto.isSdUser,
      );
      return {
        message: "User created",
        data: [],

        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      if (error.code === "UsernameExistsException") {
        error.message = "Email already exists";
      } else if (error.code === "InvalidPasswordException") {
        error.message =
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      } else if (error.code === "InvalidParameterException") {
        error.message =
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      } else if (error.code === "InvalidEmailException") {
        error.message = "Invalid email address";
      } else if (error.code === "InvalidPhoneException") {
        error.message = "Invalid phone number";
      } else {
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

  @Post("signin")
  async signIn(@Body() signInDto: SignInDto) {
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

      const response = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );

      const isAdmin = user.userType === USER_TYPE.SUPER_USER;
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
            lastName: user.lastName,
            userType: user.userType,
            agencyId: user.agencyId,
            agencyName: user.agency?.agencyName ?? "",
            // Logical alias of agencyName — the profile form field is named companyName
            companyName: user.agency?.agencyName ?? "",
            usersAccess: isAdmin,
            createProjectAccess: isAdmin,
            assetsAccess: isAdmin,
          },
        },
      };
    } catch (error) {
      this.loggerService.error(error);
      if (error.code === "NotAuthorizedException") {
        error.message = "The login credentials are invalid. Please try again";
      } else if (error.code === "UserNotConfirmedException") {
        return {
          message: "notConfirmed",
          data: { type: "UserNotConfirmedException" },
          statusCode: 201,
          success: false,
        };
      } else {
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

  @Post("refresh-token")
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    try {
      const sendRefreshToken =
        await this.authService.refreshToken(refreshToken);
      return {
        message: "New Refresh Token",
        data: sendRefreshToken,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw new Error(error.message);
    }
  }

  @Post("check-domain")
  async checkDomain(@Body("email") email: string) {
    try {
      const user = await this.authService.getUserByEmail(
        { where: { email } },
        {
          select: ["userId"],
        },
      );
      if (user) {
        return {
          message: "The email address is already registered.",
          data: null,
          success: false,
        };
      }
      if (isPublicEmailDomain(email)) {
        return {
          message: "You cannot register using a public domain email address.",
          data: { shouldBeVerified: false },
          statusCode: 400,
          success: false,
        };
      }
      const agency = await this.authService.getAgencyByEmailDomain(email);
      if (!agency) {
        return {
          message:
            "Your organization is not registered. Please contact your administrator.",
          data: { shouldBeVerified: false },
          statusCode: 400,
          success: false,
        };
      }
      return {
        message: "",
        data: { shouldBeVerified: false },
      };
    } catch (error) {
      this.loggerService.error(error);
      throw new Error(error.message);
    }
  }

  @Post("confirm-sign-up")
  async confirmSignUp(@Body() confirmSignUpDto: ConfirmSignUpDto) {
    let messageFail = "";
    try {
      const data = await this.authService.confirmSignUp(
        confirmSignUpDto.confirmationCode,
        confirmSignUpDto.email,
      );
      return {
        message: "",
        statusCode: 201,
        data,
      };
    } catch (error) {
      this.loggerService.error(error);
      if (error.code === "CodeMismatchException") {
        messageFail = "Invalid verification code.";
      } else if (error.code === "ExpiredCodeException") {
        messageFail =
          "The verification code has expired. Please request a new one.";
      } else if (error.code === "NotAuthorizedException") {
        messageFail = "This email address is already verified.";
      } else {
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
  @Post("assign-demo-project")
  async assignDemoProject(@Body() data: any) {
    try {
      await this.authService.assignDemoProject(data.userId);
      return {
        message: "",
        statusCode: 201,
        data: [],
      };
    } catch (error) {
      return {
        message: `${error}`,
        statusCode: 400,
        data: [],
        success: false,
      };
    }
  }

  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
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
      await this.authService.forgotPassword(email);
      return {
        message: "Verification code sent, check your email",
        data: [],
      };
    } catch (error) {
      this.loggerService.error(error);
      throw new Error(error.message);
    }
  }

  @Put("confirm-forgot-password")
  async confirmForgotPassword(
    @Body() confirmForgotPasswordDto: ConfirmForgotPasswordDto,
  ) {
    try {
      const data = await this.authService.confirmForgotPassword(
        confirmForgotPasswordDto.email,
        confirmForgotPasswordDto.confirmationCode,
        confirmForgotPasswordDto.newPassword,
      );
      return {
        message: "Password changed successfully",
        data,
        statusCode: 201,
      };
    } catch (error) {
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

  @Post("resend-code")
  async resendConfirmationCode(@Body() body: { email: string }) {
    try {
      await this.authService.resendConfirmationCode(body.email);
      return {
        message: "Verification code resent. Please check your email.",
        data: [],
      };
    } catch (error) {
      this.loggerService.error(error);
      throw new Error(error.message);
    }
  }

  @Put("change-password")
  @SetMetadata(SKIP_AUTH_KEY, false)
  @ApiBearerAuth("access-token")
  async changePassword(
    @Req() req: Request & { user: AdmUser },
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: ChangePasswordDto,
  ) {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token || !req.user) throw new UnauthorizedException();
    if (body.previousPassword === body.proposedPassword) {
      throw new BadRequestException(
        "New password must differ from the current password.",
      );
    }
    try {
      await this.authService.changePassword(
        token,
        body.previousPassword,
        body.proposedPassword,
        req.user.userId,
      );
      return { message: "Password changed successfully", data: null };
    } catch (error) {
      if (error.code === "NotAuthorizedException") {
        throw new BadRequestException("Current password is invalid.");
      }
      if (
        [
          "InvalidPasswordException",
          "PasswordHistoryPolicyViolationException",
          "InvalidParameterException",
        ].includes(error.code)
      ) {
        throw new BadRequestException(
          "New password does not meet the password policy.",
        );
      }
      if (
        ["LimitExceededException", "TooManyRequestsException"].includes(
          error.code,
        )
      ) {
        throw new HttpException(
          "Too many attempts. Please try again later.",
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new InternalServerErrorException(
        "Unable to change password. Please try again later.",
      );
    }
  }
}
