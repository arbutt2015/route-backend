import { Injectable } from "@nestjs/common";
import { AdmProjectUserRoleRepo } from "./adm-project-user-role.repo";

@Injectable()
export class AdmProjectUserRoleService {
  constructor(private readonly projectUserRoleRepo: AdmProjectUserRoleRepo) {}

  async createProjectUserRole(createProjectUserRoleDto: {
    projectId: number;
    userId: number;
  }) {
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
        relations: ["user"],
      },
    );
    return response.map((projectUser) => {
      return {
        projectId: projectUser.projectId,
        userId: projectUser.userId,
        email: projectUser.user.email,
        firstName: projectUser.user.firstName,
        lastName: projectUser.user.lastName,
      };
    });
  }

  async getUsersByProject(projectId: number) {
    const response = await this.getAllProjectUsersRoles(
      {
        where: {
          project: {
            projectId,
          },
        },
      },
      {
        relations: ["user"],
      },
    );
    return response.map((projectUser) => {
      return {
        projectId: projectUser.projectId,
        userId: projectUser.userId,
        email: projectUser.user.email,
        firstName: projectUser.user.firstName,
        lastName: projectUser.user.lastName,
      };
    });
  }

  async deleteProjectUserRole(projectId: number, userId: number) {
    return await this.projectUserRoleRepo.deleteProjectUserRole(
      projectId,
      userId,
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
            ...(projectId ? { projectId } : {}),
            isActive: true,
          },
        },
      },
      {
        relations: ["project", "project.agency"],
      },
    );
  }
}
