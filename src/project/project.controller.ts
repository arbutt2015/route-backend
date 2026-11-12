import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
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
      const response = await this.projectService.getAllProjectByEmail(
        Number(userId),
      );
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

  @Post("create")
  async createProject(
    @User("userId") userId: number,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    try {
      const checkProjectNumber =
        await this.projectService.checkProjectNumberExists(
          createProjectDto.projectNumber,
        );
      if (checkProjectNumber) {
        return {
          message: "Project number already exists",
          data: [],
          statusCode: 400,
        };
      }

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
      if (updateProjectDto.projectNumber) {
        const checkProjectNumber =
          await this.projectService.checkProjectNumberExists(
            updateProjectDto.projectNumber,
          );
        if (checkProjectNumber) {
          return {
            message: "Project number already exists",
            data: [],
            statusCode: 400,
          };
        }
      }

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
  async uploadFiles(
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(
      `[upload-file] content-type: ${req?.headers?.["content-type"]} | content-length: ${req?.headers?.["content-length"]} | files: ${files?.length ?? 0} | body keys: ${JSON.stringify(Object.keys(req?.body ?? {}))} | body.file: ${typeof req?.body?.file === "string" ? req.body.file : req?.body?.file}`,
    );
    try {
      if (!files || files.length === 0) {
        console.log(
          `[upload-file] request reached handler but files array is empty (multer rejected or field-name mismatch — expected field "file")`,
        );
        return {
          message: "No files uploaded",
          data: [],
          statusCode: 400,
        };
      }
      files.forEach((file) =>
        console.log(
          `[upload-file] received -> original: ${file.originalname} | saved as: ${UPLOAD_DIR}/${file.filename} | size: ${file.size} bytes`,
        ),
      );

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
