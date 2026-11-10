import { AdmRoleFeatureRepo } from "./adm-role-feature.repo";
import { FeatureDto } from "./dto/create-feature.dto";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { AdmProjectUserRoleService } from "src/adm-project-user-role/adm-project-user-role.service";
export declare class AdmRoleFeatureService {
    private readonly admRoleFeatureRepository;
    private admUserService;
    private admProjectUserRoleService;
    constructor(admRoleFeatureRepository: AdmRoleFeatureRepo, admUserService: AdmUserService, admProjectUserRoleService: AdmProjectUserRoleService);
    createRoleFeature(createRoleWithFeaturesDto: FeatureDto): Promise<any>;
    getAllRolesFeatures(): Promise<any[]>;
    getRolesAndFeaturesByIds(roleId: string, featureId?: string, options?: any): Promise<any>;
    getRolesFeaturesByRoleIdByProjectId(projectId: number, userId: any): Promise<{
        roleFeature: any[];
        projectWithRegion: any;
    }>;
}
