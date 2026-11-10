import { AdmRoleService } from "./adm-role.service";
import { CreateRoleDto } from "./dto/create-update.dto";
import { LoggingService } from "src/common/graylog.common";
export declare class AdmRoleController {
    private readonly admRoleService;
    private readonly loggerService;
    constructor(admRoleService: AdmRoleService, loggerService: LoggingService);
    getRolesById(roleId: string): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    getAllRoles(): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    create(createRoleDto: CreateRoleDto): Promise<{
        message: string;
        data: any;
        statusCode: number;
    }>;
    delete(createRoleDto: any): Promise<{
        message: string;
        data: void;
        statusCode: number;
    }>;
}
