import { GeneRepoService } from "src/gene-repo/gene-repo.service";
export declare class ProjectRepo {
    private geneRepoService;
    private projectRepository;
    constructor(geneRepoService: GeneRepoService);
    getAllProjects(filter?: any, options?: any): Promise<any[]>;
    getOneProjects(filter?: any, options?: any): Promise<any>;
    checkProjectNameExists(projectName: string): Promise<any>;
    checkProjectNumberExists(projectNumber: string): Promise<any>;
    updateIsActiveStatus(projectId: number, isActive: boolean): Promise<any>;
    createProject(project: any): Promise<any>;
    updateById(id: number, data: any): Promise<any>;
}
