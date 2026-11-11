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
                projectId: number;
                projectNumber: string;
                projectName: string;
                description: string;
                routeCode: string;
                agencyName: string;
                projectS3BucketFolderPath: string;
                geoJsonS3FilePath: string;
                boundingBox: any[];
                regions: any[];
                projectKmlGeoJson: string;
                isExportable: boolean;
                projectDataExportUrl: string;
                isEnableLens: boolean;
                isEnablePlanner: boolean;
                isEnableAnalytics: boolean;
                roadViewEnabled: boolean;
                viewerEnabled: boolean;
            };
            projectUserRoleId: number;
            roleId: number;
            isEnableLens: boolean;
            isEnablePlanner: boolean;
            isEnableAnalytics: boolean;
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
