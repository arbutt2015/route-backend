import { AdmProjectUserRoleService } from "./adm-project-user-role.service";
import { CreateProjectUserRoleDto, GetUsersByProjectAndRoleIdDto } from "./dto/create-update.dto";
import { LoggerService } from "src/logger/logger.service";
export declare class AdmProjectUserRoleController {
    private readonly projectUserRoleService;
    private readonly loggerService;
    constructor(projectUserRoleService: AdmProjectUserRoleService, loggerService: LoggerService);
    getAllProjectRoles(projectId: number): Promise<{
        message: string;
        data: {
            projectUserRoleId: any;
            userId: any;
            email: any;
            firstName: any;
            lastName: any;
            roleId: any;
            roleName: any;
        }[];
        statusCode: number;
    }>;
    createProjectRole(data: CreateProjectUserRoleDto): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    deleteProjectRole(projectUserRoleId: number): Promise<{
        message: string;
        data: void;
        statusCode: number;
    }>;
    getUsersByProjectAndRoleId(query: GetUsersByProjectAndRoleIdDto): Promise<{
        message: string;
        data: {
            projectUserRoleId: any;
            userId: any;
            email: any;
            firstName: any;
            lastName: any;
        }[];
        statusCode: number;
    }>;
}
