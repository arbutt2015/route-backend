import { Controller, Post, Body, Put, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { SignInDto } from "./dto/signIn.dto";
import { ConfirmSignUpDto } from "./dto/confirm-sign-up.dto";
import { ConfirmForgotPasswordDto } from "./dto/confirm-forgot-password.dto";
import { isPublicEmailDomain } from "../common/email-domain-checker..common";
import { LoggerService } from "src/logger/logger.service";
import { SkipAuth } from "./skip-auth.decorator";
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
      if (user?.isVerified === false) {
        return {
          message: "notConfirmed",
          data: { type: "UserNotConfirmedException" },
          statusCode: 201,
          success: false,
        };
      }

      const response = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );

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
    } catch (error) {
      this.loggerService.error(error);
      if (error.code === "NotAuthorizedException") {
        error.message = "The login credentials are invalid. Please try again";
      } else if (error.code === "UserNotConfirmedException") {
        error.message = "User not confirmed";
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
          select: ["isVerified"],
        },
      );
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
      if (isPublicEmailDomain(email)) {
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
      if (data?.isVerified === false) {
        return {
          message:
            "Your email is not verified. Please verify your email first.",
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
  async changePassword(
    @Req() req,
    @Body("refreshToken") refreshToken: string,
    @Body("previousPassword") previousPassword: string,
    @Body("proposedPassword") proposedPassword: string,
    @Body("userId") userId: number,
  ) {
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
      const data = await this.authService.changePassword(
        token,
        previousPassword,
        proposedPassword,
        userId,
      );
      return {
        message: "Password changed successfully",
        data: data,
      };
    } catch (error) {
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
}
