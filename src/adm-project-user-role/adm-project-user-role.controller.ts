import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { AdmProjectUserRoleService } from "./adm-project-user-role.service";

import {
  CreateProjectUserRoleDto,
  GetUsersByProjectAndRoleIdDto,
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
        message: "Project user role list",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Post("add-update")
  async createProjectRole(@Body() data: CreateProjectUserRoleDto) {
    try {
      const { projectId: project, userId: user, roleId: role } = data;
      const response = await this.projectUserRoleService.createProjectUserRole({
        projectUserRoleId: data.projectUserRoleId,
        project,
        user,
        role,
      });
      return {
        message: "Project Role created successfully",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Delete("delete")
  async deleteProjectRole(@Body() projectUserRoleId: number) {
    try {
      const response =
        await this.projectUserRoleService.deleteProjectUserRole(
          projectUserRoleId,
        );
      return {
        message: "Project Role deleted successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get("get-users-by-project-role-id")
  async getUsersByProjectAndRoleId(
    @Query() query: GetUsersByProjectAndRoleIdDto,
  ) {
    const { projectId, roleCode } = query;
    try {
      const response =
        await this.projectUserRoleService.getUsersByProjectAndRoleId(
          projectId,
          roleCode,
        );
      return {
        message: "Project user role list",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }
}
