import { Injectable } from "@nestjs/common";
import { AdmProjectUserRoleRepo } from "./adm-project-user-role.repo";

@Injectable()
export class AdmProjectUserRoleService {
  constructor(private readonly projectUserRoleRepo: AdmProjectUserRoleRepo) {}

  async createProjectUserRole(createProjectUserRoleDto: any) {
    return await this.projectUserRoleRepo.createProjectUserRole(
      createProjectUserRoleDto,
    );
  }

  async getAllProjectUsersRoles(filter?: any, options?: any) {
    return await this.projectUserRoleRepo.getAllProjectUsersRoles(
      filter,
      options,
    );
  }

  async getAllProjectUsersRoleWithSpecificFormate(projectId: number) {
    const response = await this.getAllProjectUsersRoles(
      {
        where: {
          project: {
            projectId,
          },
        },
      },
      {
        relations: ["user", "role"],
      },
    );
    return response.map((projectUserRole) => {
      return {
        projectUserRoleId: projectUserRole.projectUserRoleId,
        userId: projectUserRole.user.userId,
        email: projectUserRole.user.email,
        firstName: projectUserRole.user.firstName,
        lastName: projectUserRole.user.lastName,
        roleId: projectUserRole.role.roleId,
        roleName: projectUserRole.role.roleName,
      };
    });
  }
  async getUsersByProjectAndRoleId(projectId: number, roleCode: string) {
    const response = await this.getAllProjectUsersRoles(
      {
        where: {
          project: {
            projectId,
          },
          role: {
            roleCode,
          },
        },
      },
      {
        relations: ["user"],
      },
    );
    return response.map((projectUserRole) => {
      return {
        projectUserRoleId: projectUserRole.projectUserRoleId,
        userId: projectUserRole.user.userId,
        email: projectUserRole.user.email,
        firstName: projectUserRole.user.firstName,
        lastName: projectUserRole.user.lastName,
      };
    });
  }

  async deleteProjectUserRole(projectUserRoleId: number) {
    return await this.projectUserRoleRepo.deleteProjectUserRole(
      projectUserRoleId,
    );
  }

  async getProjectByUserId(userId: number, projectId?: number) {
    return await this.getAllProjectUsersRoles(
      {
        where: {
          user: {
            userId: userId,
          },
          project: {
            projectId: projectId,
            isActive: true,
          },
        },
      },
      {
        select: [
          "role.roleId",
          "project.projectId",
          "project.projectNumber",
          "project.projectS3BucketFolderPath",
          "project.projectName",
        ],
        relations: [
          "project",
          "project.projectRegions",
          "project.projectRegions.pipelineRegionStatuses",
          "project.projectRegions.projectRegionCollectionKmls",
          "role",
        ],
      },
    );
  }
}
