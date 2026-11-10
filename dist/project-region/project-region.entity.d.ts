import { PipelineRegionStatus } from "../pipeline-region-status/pipeline-region-status.entity";
import { ProjectRegionCollectionKml } from "../project-region-collection-kml/project-region-collection-kml.entity";
import { Project } from "src/project/project.entity";
export declare class ProjectRegion {
    regionId: number;
    regionName: string;
    regionBaseShapeFilePath: string;
    isActive: boolean;
    dateCreated: Date;
    dateUpdated: Date;
    regionCode: string;
    validationStatus: number;
    regionKmlGeoJson: string | null;
    lockRegion: boolean;
    project: Project;
    pipelineRegionStatuses: PipelineRegionStatus[];
    projectRegionCollectionKmls: ProjectRegionCollectionKml[];
}
