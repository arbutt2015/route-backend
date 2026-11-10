import { GeneRepoService } from "src/gene-repo/gene-repo.service";
export declare class ProjectRepo {
    private geneRepoService;
    private projectRepository;
    constructor(geneRepoService: GeneRepoService);
    getAllProjects(filter?: any, options?: any): Promise<any[]>;
    getOneProjects(filter?: any, options?: any): Promise<any>;
    getAllProjectsForCollector(projectId: number, userId: number): Promise<any>;
    getProjectById(projectId: number): Promise<{
        projectId: any;
        projectName: any;
        projectS3BucketFolderPath: any;
        client: {
            id: any;
            name: any;
        };
        agency: {
            id: any;
            name: any;
        };
        clientPOC: {
            userId: any;
            email: any;
        };
        regions: any[];
    }>;
    checkProjectNumberExists(projectNumber: string): Promise<any>;
    updateDownloadStatus(projectId: number): Promise<any>;
    updateIsActiveStatus(projectId: number, isActive: boolean): Promise<any>;
    checkProjectNameExists(projectName: string): Promise<any>;
    getDefaultProjectTypeId(filter?: any, options?: any): Promise<any>;
    createProject(project: any): Promise<any>;
    updateById(id: number, data: any): Promise<any>;
}
