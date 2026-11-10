import { HttpService } from "@nestjs/axios";
import { ProjectRepo } from "./project.repo";
import { CreateProjectDto } from "./dto/create-project.dto";
import { AWSS3Service } from "src/aws/aws-s3.service";
import { AdmProjectUserRoleService } from "src/adm-project-user-role/adm-project-user-role.service";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "src/logger/logger.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
export declare class ProjectService {
    private projectRepo;
    private awsS3Service;
    private readonly configService;
    private readonly admProjectUserRoleService;
    private readonly httpService;
    private readonly loggerService;
    constructor(projectRepo: ProjectRepo, awsS3Service: AWSS3Service, configService: ConfigService, admProjectUserRoleService: AdmProjectUserRoleService, httpService: HttpService, loggerService: LoggerService);
    getAllProjectByEmail(userId: number): Promise<{
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
    }[]>;
    getAllProjects(filter?: any, options?: any): Promise<any[]>;
    getOneProjects(filter?: any, options?: any): Promise<any>;
    downloadFile(filter?: any, options?: any): Promise<{
        url: string;
    }>;
    getAllProjectsForCollector(projectId: number, userId: number): Promise<{
        details: any[];
        projectName: any;
        projectId: any;
        projectNumber: any;
    }>;
    projectDetailCount(projectId: number, userId: number): Promise<{
        regionCount: any;
        areaCount: any;
    }>;
    getAllProjectsGeoJSON(projectId: number, userId: number): Promise<any[]>;
    getAllProjectWithSpecificField(): Promise<{
        projectId: any;
        projectName: any;
        projectNumber: any;
        projectS3BucketFolderPath: any;
        status: any;
    }[]>;
    createProject(createProject: CreateProjectDto, userId?: any): Promise<any>;
    updateProject(updateProject: UpdateProjectDto): Promise<any>;
    checkProjectNumberExists(projectNumber: string): Promise<any>;
    updateDownloadStatus(projectId: number): Promise<any>;
    updateIsActiveStatus(projectId: number, isActive: boolean): Promise<any>;
    checkProjectNameExists(projectName: string): Promise<any>;
    getGeoJSON(country: string, stateCode: string, s3Path: string): Promise<any>;
    private extractRegionAndAreaInfo;
    private extractRegionAndAreaInfoCount;
    updateBoundingBoxForAllProjects(): Promise<{
        message: string;
    }>;
    updateWorkstations(projectId: number, data: {
        daWorkstation?: string;
        aiWorkstation?: string;
    }): Promise<any>;
}
