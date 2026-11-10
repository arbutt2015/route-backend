import { AdmModuleRepo } from "./adm-module.repo";
export declare class AdmModuleService {
    private moduleRepo;
    constructor(moduleRepo: AdmModuleRepo);
    getAllModules(filter?: any, options?: any): Promise<any[]>;
    createORUpdateModule(createModuleDto: any): Promise<any>;
}
