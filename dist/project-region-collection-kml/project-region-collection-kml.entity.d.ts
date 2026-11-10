import { ProjectRegion } from "../project-region/project-region.entity";
export declare class ProjectRegionCollectionKml {
    regionCollectionKmlId: number;
    collectionKmlPath: string;
    collectionRound: number;
    collectionName: string;
    collectionKmlGeoJsonPath: string | null;
    isActive: boolean;
    isPending: boolean | null;
    region: ProjectRegion;
}
