import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  ValidationPipe,
} from "@nestjs/common";
import { AdmUserService } from "./adm-user.service";

import { LoggerService } from "src/logger/logger.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { AdmUser } from "./adm-user.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { SkipRolesGuard } from "../auth/decorator/skip-role.guard.decorator";

@Controller("users")
@ApiTags("User")
export class AdmUserController {
  constructor(
    private readonly userService: AdmUserService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get("me")
  @SkipRolesGuard()
  @ApiBearerAuth("access-token")
  async getProfile(@Req() req: Request & { user: AdmUser }) {
    return {
      message: "Profile fetched successfully",
      data: await this.userService.getProfile(req.user.userId),
    };
  }

  @Patch("me")
  @SkipRolesGuard()
  @ApiBearerAuth("access-token")
  async updateProfile(
    @Req() req: Request & { user: AdmUser },
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    profile: UpdateProfileDto,
  ) {
    return {
      message: "Profile updated successfully",
      data: await this.userService.updateProfile(req.user.userId, profile),
    };
  }

  @Get("get-all")
  async getAllUsers() {
    try {
      const response = await this.userService.getAllUsers({
        where: { isVerified: true },
      });
      return {
        message: "Users fetched successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get("get-sd-users")
  async getSdUsers() {
    try {
      const response = await this.userService.getSdUsers({
        where: { isSdUser: true, isActive: true },
      });
      return {
        message: "Users fetched successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get("get-user-by-id")
  async getUserById(@Query("userId") userId: number) {
    try {
      const response = await this.userService.getUser({
        where: { userId: userId },
      });
      return {
        message: "User fetched successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Patch("update-user-by-id")
  async updateUserById(@Body() userUpdateDto: any) {
    try {
      const userId = userUpdateDto?.userId;
      delete userUpdateDto.userId;
      const response = (
        await this.userService.updateUserByWhereAndGetData(
          {
            where: { userId },
          },
          {
            ...userUpdateDto,
          },
        )
      )[0];
      return {
        message: "User updated successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Delete(":id")
  async deleteUser(@Param("id", ParseIntPipe) userId: number) {
    try {
      await this.userService.deleteUser(userId);
      return {
        message: "User deleted",
        data: null,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }
}
