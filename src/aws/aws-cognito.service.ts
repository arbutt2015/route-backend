import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import * as crypto from "crypto";
import { LoggerService } from "src/logger/logger.service";

@Injectable()
export class AWSCognitoService {
  private clientId: string;
  private userPoolId: string;
  private clientSecret: string;
  private readonly cognito: AWS.CognitoIdentityServiceProvider;

  constructor(
    private configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    AWS.config.update({
      region: this.configService.get<string>("AWS_POOL_REGION"),
    });
    this.clientId = this.configService.get<string>("AWS_COGNITO_CLIENT_ID");
    this.userPoolId = this.configService.get<string>("AWS_POOL_USER_ID");
    this.clientSecret = this.configService.get<string>(
      "AWS_COGNITO_CLIENT_SECRET",
    );
    this.cognito = new AWS.CognitoIdentityServiceProvider();
  }
  generateSecrete(email: string, clientId: string, clientSecret: string) {
    return crypto
      .createHmac("sha256", clientSecret)
      .update(email + clientId)
      .digest("base64");
  }
  async signUp(
    email: string,
    password: string,
    isVerified: boolean = false,
  ): Promise<any> {
    const secretHash = this.generateSecrete(
      email,
      this.clientId,
      this.clientSecret,
    );

    const params: AWS.CognitoIdentityServiceProvider.SignUpRequest = {
      ClientId: this.clientId,
      Username: email,
      Password: password,
      SecretHash: secretHash,
      ClientMetadata: {
        userType: isVerified ? "internal" : "external",
      },
    };
    const result = await this.cognito.signUp(params).promise();

    // if (isVerified) {
    //   await this.cognito
    //     .adminUpdateUserAttributes({
    //       UserPoolId: this.userPoolId,
    //       Username: email,
    //       UserAttributes: [{ Name: "email_verified", Value: "true" }],
    //     })
    //     .promise();

    //   await this.cognito
    //     .adminConfirmSignUp({
    //       UserPoolId: this.userPoolId,
    //       Username: email,
    //     })
    //     .promise();
    // }

    return result;
  }
  async confirmSignUp(confirmationCode: string, email: string): Promise<any> {
    const secretHash = await this.generateSecrete(
      email,
      this.clientId,
      this.clientSecret,
    );

    const params = {
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: secretHash,
    };
    await this.cognito.confirmSignUp(params).promise();
    this.loggerService.log("User confirmed successfully.");
    await this.verifyEmail(email);
    this.loggerService.log("User email verified successfully.");
    return {
      message: "Email confirmation successful. You can now log in.",
    };
  }
  async resendConfirmationCode(email: string): Promise<void> {
    const secretHash = this.generateSecrete(
      email,
      this.clientId,
      this.clientSecret,
    );

    const params = {
      ClientId: this.clientId,
      Username: email,
      SecretHash: secretHash,
    };

    await this.cognito.resendConfirmationCode(params).promise();
  }
  async verifyEmail(username: string) {
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
  async signIn(email: string, password: string) {
    const secretHash = await this.generateSecrete(
      email,
      this.clientId,
      this.clientSecret,
    );
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

  async forgotPassword(email: string) {
    const secretHash = await this.generateSecrete(
      email,
      this.clientId,
      this.clientSecret,
    );
    const params: AWS.CognitoIdentityServiceProvider.ForgotPasswordRequest = {
      ClientId: this.configService.get<string>("AWS_COGNITO_CLIENT_ID"),
      SecretHash: secretHash,
      Username: email,
    };

    return await this.cognito.forgotPassword(params).promise();
  }

  async confirmForgotPassword(
    email: string,
    confirmationCode: string,
    newPassword: string,
  ) {
    const secretHash = await this.generateSecrete(
      email,
      this.clientId,
      this.clientSecret,
    );
    const params: AWS.CognitoIdentityServiceProvider.ConfirmForgotPasswordRequest =
      {
        ClientId: this.clientId,
        Username: email,
        SecretHash: secretHash,
        ConfirmationCode: confirmationCode,
        Password: newPassword,
      };

    return await this.cognito.confirmForgotPassword(params).promise();
  }

  async refreshToken(refreshToken: string) {
    const params = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: this.clientId, // Use the same CLIENT_ID as in the AWS Cognito configuration
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
    } catch (error) {
      throw new Error(`Error refreshing token: ${error.message}`);
    }
  }
  async changePassword(
    accessToken: string,
    previousPassword: string,
    proposedPassword: string,
  ): Promise<any> {
    const params: AWS.CognitoIdentityServiceProvider.ChangePasswordRequest = {
      AccessToken: accessToken,
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword,
    };

    try {
      const response = await this.cognito.changePassword(params).promise();
      this.loggerService.log("Password changed successfully.");
      return response;
    } catch (error) {
      this.loggerService.error("Error changing password:", error);
      throw error;
    }
  }
  async deleteUser(username: string): Promise<any> {
    const params: AWS.CognitoIdentityServiceProvider.AdminDeleteUserRequest = {
      UserPoolId: this.userPoolId,
      Username: username,
    };

    try {
      await this.cognito.adminDeleteUser(params).promise();
      this.loggerService.log(`User ${username} deleted successfully.`);
      return { message: `User ${username} deleted successfully.` };
    } catch (error) {
      this.loggerService.error(`Error deleting user: ${error.message}`);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
