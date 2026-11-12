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
                description: any;
                routeCode: string;
                agencyName: any;
                agencyId: any;
                kmlFileUrl: any;
                geoJsonS3FilePath: any;
                boundingBox: any[];
                regions: any[];
                projectKmlGeoJson: any;
                isEnableLens: boolean;
                isEnablePlanner: boolean;
                isEnableAnalytics: boolean;
                roadViewEnabled: boolean;
                viewerEnabled: boolean;
            };
            projectUserId: any;
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
    createProject(userId: number, createProjectDto: CreateProjectDto): Promise<{
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
    uploadFiles(req: any, files: Express.Multer.File[]): Promise<{
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
}
