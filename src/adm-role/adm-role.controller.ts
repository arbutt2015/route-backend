import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { AdmRoleService } from "./adm-role.service";

import { CreateRoleDto } from "./dto/create-update.dto";
import { LoggingService } from "src/common/graylog.common";

@Controller("role")
export class AdmRoleController {
  constructor(
    private readonly admRoleService: AdmRoleService,
    private readonly loggerService: LoggingService,
  ) {}

  @Get("role-by-id")
  async getRolesById(@Query("roleId") roleId: string) {
    try {
      const response = await this.admRoleService.getRolesById(roleId);
      return {
        message: "Role details fetched successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Get("getAll")
  async getAllRoles() {
    try {
      const response = await this.admRoleService.getAllRoles();
      return {
        message: "All roles fetched successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Post("create-update")
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      const response = await this.admRoleService.createRole({
        roleId: createRoleDto?.roleId,
        roleName: createRoleDto?.roleName,
        roleDescription: createRoleDto?.roleDescription,
        roleCode: createRoleDto?.roleCode,
      });
      return {
        message: "Role created successfully",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Delete("delete")
  async delete(@Body() createRoleDto: any) {
    try {
      const response = await this.admRoleService.deleteRole(
        createRoleDto.roleId,
      );
      return {
        message: "Role deleted successfully",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }
}
