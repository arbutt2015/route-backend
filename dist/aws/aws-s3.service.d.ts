import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { LoggerService } from "src/logger/logger.service";
export declare class AWSS3Service {
    private configurationService;
    private loggerService;
    private s3;
    S3_BUCKET_ROOT_FOLDER: string;
    constructor(configurationService: ConfigService, loggerService: LoggerService);
    formatePath: (agencyName: string, projectName: string, clientName: string, date: string, projectUniqueId: string) => {
        agency: string;
        clientName: string;
        project: string;
        clientData: string;
        data: string;
        metaData: string;
    };
    createDirectoryORFileUploadOld(folderPath: string, fileData?: any): Promise<{
        Location: any;
    } | {
        Location?: undefined;
    }>;
    createDirectoryORFileUpload(folderPath: string, fileData?: any): Promise<{
        Location: string;
    } | {
        Location?: undefined;
    }>;
    createEmptyFolder(folderPath: string): Promise<void>;
    checkDirectoryExists(directory: string): Promise<boolean>;
    makeFilePublic(fileKey: any): Promise<void>;
    deleteObject(url: string): Promise<void>;
    deleteFolder(url: string): Promise<void>;
    extractBucketAndKey(url: string): {
        Bucket: string;
        Key: string;
    };
    getFileFromS3(ur: string): Promise<AWS.S3.GetObjectOutput>;
    collectorUploadFileS3(folderPath: string, file: any, lat: number | null, lon: number | null): Promise<AWS.S3.ManagedUpload.SendData>;
    getFileNameFromUrl(fileUrl: string): string;
    getPresignedUrl(url: string): Promise<string>;
    completeMultipartUpload(uploadId: string, key: string, parts: {
        PartNumber: number;
        ETag: string;
    }[]): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.S3.CompleteMultipartUploadOutput, AWS.AWSError>>;
    getPresignedUrlForPutObject(file: {
        name: string;
        type: string;
    }, key: string): Promise<string>;
    getFolderData(baseFolder: string): Promise<any[]>;
}
