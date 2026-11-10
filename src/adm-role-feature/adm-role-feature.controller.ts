import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AdmRoleFeatureService } from "./adm-role-feature.service";

import { CreateFeatureDto } from "./dto/create-feature.dto";
import { LoggerService } from "src/logger/logger.service";
import { User } from "src/adm-user/decorators/user.decorators";

@Controller("role-feature")
export class AdmRoleFeatureController {
  constructor(
    private readonly admRoleFeatureService: AdmRoleFeatureService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  async getAllRolesFeatures() {
    try {
      const response = await this.admRoleFeatureService.getAllRolesFeatures();
      return {
        message: "Roles features fetched successfully",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Post("create")
  async create(@Body() createRoleWithFeaturesDto: CreateFeatureDto) {
    try {
      for (const feature of createRoleWithFeaturesDto.features) {
        await this.admRoleFeatureService.createRoleFeature({
          roleId: createRoleWithFeaturesDto.roleId,
          ...feature,
        });
      }
      return {
        message: "Role features created successfully",
        data: [],
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Get("get-by-project")
  async getRolesAndFeaturesByIds(
    @User("userId") userId: string,
    @Query("projectId") projectId: any,
  ) {
    try {
      const response =
        await this.admRoleFeatureService.getRolesFeaturesByRoleIdByProjectId(
          projectId,
          userId,
        );
      return {
        message: "Roles and features fetched by project",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }
}
