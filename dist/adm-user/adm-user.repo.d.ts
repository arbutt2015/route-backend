import { GeneRepoService } from "src/gene-repo/gene-repo.service";
import { CreateUser } from "./interfaces/user.interface";
export declare class AdmUserRepo {
    private geneRepoService;
    private userRepository;
    constructor(geneRepoService: GeneRepoService);
    getAllUsers(filter?: any, options?: any): Promise<any[]>;
    getSdUsers(filter?: any, options?: any): Promise<any[]>;
    createUser(user: CreateUser): Promise<any>;
    getUser(filter?: any, options?: any): Promise<any>;
    getDeleteById(id: number): Promise<void>;
    updateUserByWhereAndGetData(updateFilter: any, updateBody: any, findFilter?: any, options?: any): Promise<any[]>;
}
