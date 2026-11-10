import { ProjectRegion } from "../project-region/project-region.entity";
export declare class PipelineRegionStatus {
    projectRegionStatusId: number;
    localFolderPath: string;
    usersForFiltration: number;
    uploadStatus: boolean;
    validationStatus: boolean;
    downloadStatus: boolean;
    frameExtractionStatus: boolean;
    filtrationStatus: boolean;
    finalDeliverableStatus: boolean;
    anonymizerStatus: boolean;
    imageValidationStatus: boolean;
    videoValidationStatus: boolean;
    roadViewStatus: number;
    plannerStatus: number;
    lensStatus: number;
    analyticsStatus: boolean;
    viewerStatus: number;
    finalDeliverablePath: string | null;
    duplicateCount: number;
    dateCreated: Date;
    dateUpdated: Date;
    isQaUpdate: boolean;
    region: ProjectRegion;
}
