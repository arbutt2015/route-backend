import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthCollectorService } from "./auth-collector.service";
import { LoggerService } from "src/logger/logger.service";
import { SkipAuth } from "src/auth/skip-auth.decorator";
import { CustomAuthGuard } from "./jwt-auth-collector.guard";
import { ApiTags } from "@nestjs/swagger";
import { CollectorSignInDto } from "./dto/auth-collector.dto";
import { SkipRolesGuard } from "src/auth/decorator/skip-role.guard.decorator";

@SkipAuth()
@SkipRolesGuard()
@Controller("collector-auth")
@ApiTags("Collector Auth")
export class AuthCollectorController {
  constructor(
    private readonly authService: AuthCollectorService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post("sign-in")
  async signIn(@Body() collectorSignInDto: CollectorSignInDto) {
    try {
      const response = await this.authService.collectorSignIn(
        collectorSignInDto.collectorCode,
      );
      return {
        message: "Sign-in successful",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @UseGuards(CustomAuthGuard)
  @Get("protected-route")
  async getProtectedData() {
    return {
      message: "Protected data fetched successfully",
      data: { data: "This is protected data" },
      statusCode: 201,
    };
  }

  @Post("refresh-token")
  async refresh(@Req() req: any, @Body("refreshToken") refreshToken: string) {
    const payload = await this.authService.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const newAccessToken = await this.authService.generateAccessToken({
      sub: payload.sub,
      collectorCode: payload.collectorCode,
      projectId: payload.projectId,
      projectNumber: payload.projectNumber,
    });

    return {
      message: "Access token refreshed successfully",
      data: { accessToken: newAccessToken },
      statusCode: 201,
    };
  }
}
