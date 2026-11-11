import { ProjectRepo } from "./project.repo";
import { CreateProjectDto } from "./dto/create-project.dto";
import { AWSS3Service } from "src/aws/aws-s3.service";
import { AdmProjectUserRoleService } from "src/adm-project-user-role/adm-project-user-role.service";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { LoggerService } from "src/logger/logger.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
export declare class ProjectService {
    private projectRepo;
    private awsS3Service;
    private readonly admProjectUserRoleService;
    private readonly admUserService;
    private readonly loggerService;
    constructor(projectRepo: ProjectRepo, awsS3Service: AWSS3Service, admProjectUserRoleService: AdmProjectUserRoleService, admUserService: AdmUserService, loggerService: LoggerService);
    getAllProjectByEmail(userId: number): Promise<{
        project: {
            projectId: any;
            projectName: any;
            projectNumber: string;
            description: any;
            routeCode: string;
            agencyName: any;
            agencyId: any;
            kmlFileUrl: any;
            geoJsonS3FilePath: any;
            collectedFileUrl: any;
            boundingBox: any[];
            regions: any[];
            projectKmlGeoJson: any;
            isExportable: boolean;
            projectDataExportUrl: any;
            isEnableLens: boolean;
            isEnablePlanner: boolean;
            isEnableAnalytics: boolean;
            roadViewEnabled: boolean;
            viewerEnabled: boolean;
        };
        projectUserId: any;
    }[]>;
    getAllProjects(filter?: any, options?: any): Promise<any[]>;
    getOneProjects(filter?: any, options?: any): Promise<any>;
    downloadFile(filter?: any, options?: any): Promise<{
        url: string;
    }>;
    getAllProjectWithSpecificField(): Promise<{
        projectId: any;
        projectName: any;
        status: any;
    }[]>;
    createProject(createProject: CreateProjectDto, userId?: number): Promise<any>;
    updateProject(updateProject: UpdateProjectDto): Promise<any>;
    updateIsActiveStatus(projectId: number, isActive: boolean): Promise<any>;
    checkProjectNameExists(projectName: string): Promise<any>;
}
