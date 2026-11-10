import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { LoggerService } from "src/logger/logger.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
export declare class ProjectController {
    private projectService;
    private readonly loggerService;
    constructor(projectService: ProjectService, loggerService: LoggerService);
    getAllAssignProject(userId: any): Promise<{
        message: string;
        data: {
            project: {
                projectId: any;
                projectName: any;
                projectNumber: any;
                isEnableLens: any;
                isEnablePlanner: any;
                isEnableAnalytics: any;
                viewerEnabled: any;
                roadViewEnabled: any;
            };
        }[];
        statusCode: number;
    }>;
    getAllProject(): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    getAllActiveInactiveProject(): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    getProjectById(projectId: number): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    downloadFile(projectId: number): Promise<{
        message: string;
        data: {
            url: string;
        };
        statusCode: number;
    }>;
    createProject(userId: string, createProjectDto: CreateProjectDto): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    updateDownloadStatus(body: {
        projectId: number;
    }): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    updateIsActiveStatus(body: {
        projectId: number;
        isActive: boolean;
    }): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    updateProject(updateProjectDto: UpdateProjectDto): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    uploadFiles(files: Express.Multer.File[]): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    } | {
        message: string;
        data: {
            files: string[];
        };
        statusCode: number;
    }>;
    updateBoundingBox(): Promise<{
        message: string;
        statusCode: number;
    }>;
    updateWorkstations(projectId: string, body: {
        daWorkstation?: string;
        aiWorkstation?: string;
    }): Promise<{
        message: any;
        statusCode: number;
    }>;
}
