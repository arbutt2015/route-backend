import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { AdmProjectUserRoleService } from "./adm-project-user-role.service";

import {
  CreateProjectUserDto,
  DeleteProjectUserDto,
  GetUsersByProjectDto,
} from "./dto/create-update.dto";
import { LoggerService } from "src/logger/logger.service";

@Controller("project-user-role")
export class AdmProjectUserRoleController {
  constructor(
    private readonly projectUserRoleService: AdmProjectUserRoleService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  async getAllProjectRoles(@Query("projectId") projectId: number) {
    try {
      const response =
        await this.projectUserRoleService.getAllProjectUsersRoleWithSpecificFormate(
          projectId,
        );
      return {
        message: "Project user list",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Post("add-update")
  async createProjectRole(@Body() data: CreateProjectUserDto) {
    try {
      const response = await this.projectUserRoleService.createProjectUserRole({
        projectId: data.projectId,
        userId: data.userId,
      });
      return {
        message: "Project user created successfully",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Delete("delete")
  async deleteProjectRole(@Body() data: DeleteProjectUserDto) {
    try {
      const response = await this.projectUserRoleService.deleteProjectUserRole(
        data.projectId,
        data.userId,
      );
      return {
        message: "Project user deleted successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get("get-users-by-project")
  async getUsersByProject(@Query() query: GetUsersByProjectDto) {
    try {
      const response = await this.projectUserRoleService.getUsersByProject(
        query.projectId,
      );
      return {
        message: "Project user list",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }
}
