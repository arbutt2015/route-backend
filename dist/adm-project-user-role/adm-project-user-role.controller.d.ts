import { AdmProjectUserRoleService } from "./adm-project-user-role.service";
import { CreateProjectUserDto, DeleteProjectUserDto, GetUsersByProjectDto } from "./dto/create-update.dto";
import { LoggerService } from "src/logger/logger.service";
export declare class AdmProjectUserRoleController {
    private readonly projectUserRoleService;
    private readonly loggerService;
    constructor(projectUserRoleService: AdmProjectUserRoleService, loggerService: LoggerService);
    getAllProjectRoles(projectId: number): Promise<{
        message: string;
        data: {
            projectId: any;
            userId: any;
            email: any;
            firstName: any;
            lastName: any;
        }[];
        statusCode: number;
    }>;
    createProjectRole(data: CreateProjectUserDto): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    deleteProjectRole(data: DeleteProjectUserDto): Promise<{
        message: string;
        data: void;
        statusCode: number;
    }>;
    getUsersByProject(query: GetUsersByProjectDto): Promise<{
        message: string;
        data: {
            projectId: any;
            userId: any;
            email: any;
            firstName: any;
            lastName: any;
        }[];
        statusCode: number;
    }>;
}
