import { AdmRoleRepo } from "./adm-role.repo";
import { AdmRoleFeatureService } from "../adm-role-feature/adm-role-feature.service";
import { AdmModuleService } from "../adm-module/adm-module.service";
import { AdmFeatureService } from "src/adm-feature/adm-feature.service";
import { CreateRoleDto } from "./dto/create-update.dto";
export declare class AdmRoleService {
    private admRoleRepo;
    private admRoleFeatureService;
    private admModuleService;
    private admFeatureService;
    constructor(admRoleRepo: AdmRoleRepo, admRoleFeatureService: AdmRoleFeatureService, admModuleService: AdmModuleService, admFeatureService: AdmFeatureService);
    createRole(createRoleDto: CreateRoleDto): Promise<any>;
    getAllRoles(filter?: any, options?: any): Promise<any[]>;
    getRolesById(roleId: string): Promise<any[]>;
    deleteRole(roleId: number): Promise<void>;
}
