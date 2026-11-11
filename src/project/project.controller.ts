import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UPLOAD_DIR } from "src/common/constant.type.common";
import { getMulterConfig } from "src/common/fileUpload.common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LoggerService } from "src/logger/logger.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { User } from "src/adm-user/decorators/user.decorators";

@Controller("project")
// Apply the ResponseInterceptor to the controller
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get("get-assigned-project")
  async getAllAssignProject(@User("userId") userId: any) {
    try {
      // TODO: replace hardcoded demo projects with
      // this.projectService.getAllProjectByEmail(userId) once project data exists
      const response = [
        {
          project: {
            projectId: 1,
            projectNumber: "T0001",
            projectName: "Coastal Survey",
            description: "Coastal Survey project description.",
            routeCode: "ABC123",
            agencyName: "",
            projectS3BucketFolderPath: "",
            geoJsonS3FilePath: "Scope.geojson",
            boundingBox: [],
            regions: [],
            projectKmlGeoJson: "",
            isExportable: false,
            projectDataExportUrl: "",
            isEnableLens: false,
            isEnablePlanner: false,
            isEnableAnalytics: false,
            roadViewEnabled: false,
            viewerEnabled: false,
          },
          projectUserRoleId: 1,
          roleId: 1,
          isEnableLens: false,
          isEnablePlanner: false,
          isEnableAnalytics: false,
        },
        {
          project: {
            projectId: 2,
            projectNumber: "T0002",
            projectName: "Mountain Pine",
            description: "Mountain Pine project description.",
            routeCode: "DEF456",
            agencyName: "",
            projectS3BucketFolderPath: "",
            geoJsonS3FilePath: "Scope.geojson",
            boundingBox: [],
            regions: [],
            projectKmlGeoJson: "",
            isExportable: false,
            projectDataExportUrl: "",
            isEnableLens: false,
            isEnablePlanner: false,
            isEnableAnalytics: false,
            roadViewEnabled: false,
            viewerEnabled: false,
          },
          projectUserRoleId: 2,
          roleId: 1,
          isEnableLens: false,
          isEnablePlanner: false,
          isEnableAnalytics: false,
        },
      ];
      return {
        message: "Assigned projects retrieved successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Get("get-all")
  async getAllProject() {
    try {
      const response = await this.projectService.getAllProjects({
        where: { isActive: true },
      });
      return {
        message: "All projects retrieved successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Get("get-all-active-inactive")
  async getAllActiveInactiveProject() {
    try {
      const response = await this.projectService.getAllProjects();
      return {
        message: "All projects retrieved successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Get("get-project-by-id")
  async getProjectById(@Query("projectId") projectId: number) {
    try {
      const response = (
        await this.projectService.getAllProjects({
          where: { projectId, isActive: true },
        })
      )[0];
      return {
        message: "Project retrieved successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Get("download-file")
  async downloadFile(@Query("projectId") projectId: number) {
    try {
      const response = await this.projectService.downloadFile({
        where: {
          projectId,
          isActive: true,
        },
      });
      return {
        message: "Project retrieved successfully",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Post("create")
  async createProject(
    @User("userId") userId: number,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    try {
      const checkProjectName = await this.projectService.checkProjectNameExists(
        createProjectDto.projectName,
      );
      if (checkProjectName) {
        return {
          message: "Project name already exists",
          data: [],
          statusCode: 400,
        };
      }

      const response = await this.projectService.createProject(
        createProjectDto,
        userId,
      );
      return {
        message: "Project created successfully",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }
  @Put("update-is-active-status")
  async updateIsActiveStatus(
    @Body() body: { projectId: number; isActive: boolean },
  ) {
    if (body?.projectId) {
      const { projectId, isActive } = body;
      const response = await this.projectService.updateIsActiveStatus(
        projectId,
        isActive,
      );
      return {
        message: "Project updated successfully",
        data: response,
        statusCode: 200,
      };
    }
  }
  @Put("update")
  async updateProject(@Body() updateProjectDto: UpdateProjectDto) {
    try {
      if (updateProjectDto.projectName) {
        const checkProjectName =
          await this.projectService.checkProjectNameExists(
            updateProjectDto.projectName,
          );
        if (checkProjectName) {
          return {
            message: "Project name already exists",
            data: [],
            statusCode: 400,
          };
        }
      }

      const response =
        await this.projectService.updateProject(updateProjectDto);
      return {
        message: "Project updated successfully",
        data: response,
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }

  @Post("upload-file")
  @UseInterceptors(
    FilesInterceptor("file", 1, getMulterConfig([".kml"], UPLOAD_DIR)),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      if (!files || files.length === 0) {
        return {
          message: "No files uploaded",
          data: [],
          statusCode: 400,
        };
      }

      return {
        message: "Files uploaded successfully",
        data: {
          files: files.map((file) => file.filename),
        },
        statusCode: 201,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error; // The ResponseInterceptor will handle formatting the error response
    }
  }
}
