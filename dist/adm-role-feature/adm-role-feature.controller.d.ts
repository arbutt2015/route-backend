import { AdmRoleFeatureService } from "./adm-role-feature.service";
import { CreateFeatureDto } from "./dto/create-feature.dto";
import { LoggerService } from "src/logger/logger.service";
export declare class AdmRoleFeatureController {
    private readonly admRoleFeatureService;
    private readonly loggerService;
    constructor(admRoleFeatureService: AdmRoleFeatureService, loggerService: LoggerService);
    getAllRolesFeatures(): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    create(createRoleWithFeaturesDto: CreateFeatureDto): Promise<{
        message: string;
        data: any[];
        statusCode: number;
    }>;
    getRolesAndFeaturesByIds(userId: string, projectId: any): Promise<{
        message: string;
        data: {
            roleFeature: any[];
            projectWithRegion: any;
        };
        statusCode: number;
    }>;
}
