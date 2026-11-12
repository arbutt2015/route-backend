"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSS3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const AWS = require("aws-sdk");
const constant_type_common_1 = require("../common/constant.type.common");
const logger_service_1 = require("../logger/logger.service");
const exiftool_vendored_1 = require("exiftool-vendored");
const fs = require("fs");
const tmp = require("tmp");
let AWSS3Service = class AWSS3Service {
    constructor(configurationService, loggerService) {
        this.configurationService = configurationService;
        this.loggerService = loggerService;
        this.formatePath = (agencyName, projectName, clientName, date, projectUniqueId) => {
            return {
                agency: `${agencyName}/`,
                clientName: `${agencyName}/${clientName}/`,
                project: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/`,
                clientData: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/client-data/`,
                data: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/client-data/data/`,
                metaData: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/client-data/meta-data/`,
            };
        };
        this.s3 = new AWS.S3({
            accessKeyId: this.configurationService.get("S3_BUCKET_ACCESSKEY_ID"),
            secretAccessKey: this.configurationService.get("S3_BUCKET_SECRET_ACCESS_KEY_ID"),
            region: this.configurationService.get("S3_BUCKET_REGION"),
        });
        this.S3_BUCKET_ROOT_FOLDER = this.configurationService.get("S3_BUCKET_ROOT_FOLDER");
    }
    async createDirectoryORFileUploadOld(folderPath, fileData) {
        try {
            const params = {
                Bucket: this.S3_BUCKET_ROOT_FOLDER,
                Key: folderPath,
                Body: fileData ?? "",
                ACL: "public-read",
            };
            const directoryExists = await this.checkDirectoryExists(folderPath);
            let result;
            if (!directoryExists) {
                result = await this.s3.upload(params).promise();
                this.loggerService.log(`Folder or file "${result.Key}" created successfully in bucket "${this.S3_BUCKET_ROOT_FOLDER}".`);
                return { Location: result.Location };
            }
            else {
                this.loggerService.log(`Folder "${folderPath}" already exists.`);
                return {
                    Location: `https://${this.S3_BUCKET_ROOT_FOLDER}.s3.amazonaws.com/${folderPath}`,
                };
            }
        }
        catch (error) {
            this.loggerService.error(`Error creating folder or uploading file "${folderPath}" in bucket "${this.S3_BUCKET_ROOT_FOLDER}":`, error);
            return {};
        }
    }
    async createDirectoryORFileUpload(folderPath, fileData) {
        console.log(`[s3-upload] -> bucket: ${this.S3_BUCKET_ROOT_FOLDER} | key: ${folderPath} | body: ${fileData?.length ?? 0} bytes`);
        try {
            const params = {
                Bucket: this.S3_BUCKET_ROOT_FOLDER,
                Key: folderPath,
                Body: fileData ?? "",
                ACL: "public-read",
            };
            const result = await this.s3.upload(params).promise();
            this.loggerService.log(`File or folder "${result.Key}" uploaded/replaced successfully in bucket "${this.S3_BUCKET_ROOT_FOLDER}".`);
            return { Location: result.Location };
        }
        catch (error) {
            this.loggerService.error(`Error creating or uploading file "${folderPath}" in bucket "${this.S3_BUCKET_ROOT_FOLDER}":`, error);
            return {};
        }
    }
    async createEmptyFolder(folderPath) {
        const folderKey = folderPath.endsWith("/") ? folderPath : `${folderPath}/`;
        await this.s3
            .putObject({
            Bucket: this.S3_BUCKET_ROOT_FOLDER,
            Key: folderKey,
            Body: "",
        })
            .promise();
    }
    async checkDirectoryExists(directory) {
        try {
            const response = await this.s3
                .listObjectsV2({
                Bucket: this.S3_BUCKET_ROOT_FOLDER,
                Prefix: directory,
            })
                .promise();
            return response?.Contents?.length > 0 ? true : false;
        }
        catch (error) {
            this.loggerService.error("Error checking directory:", error);
            return false;
        }
    }
    async makeFilePublic(fileKey) {
        const params = {
            Bucket: this.S3_BUCKET_ROOT_FOLDER,
            Key: fileKey,
            ACL: "public-read",
        };
        try {
            await this.s3.putObjectAcl(params).promise();
        }
        catch (error) {
            throw error;
        }
    }
    async deleteObject(url) {
        const result = this.extractBucketAndKey(url);
        if (!result)
            return;
        const { Bucket, Key } = result;
        const params = {
            Bucket,
            Key,
        };
        try {
            this.loggerService.log(JSON.stringify(params));
            await this.s3.deleteObject(params).promise();
            this.loggerService.log(`Object deleted from S3: ${url}`);
        }
        catch (error) {
            this.loggerService.error(`Failed to delete object from S3: ${error.message}`);
        }
    }
    async deleteFolder(url) {
        const prefix = url.endsWith("/") ? url : `${url}/`;
        const listParams = {
            Bucket: this.S3_BUCKET_ROOT_FOLDER,
            Prefix: prefix,
        };
        try {
            const listedObjects = await this.s3.listObjectsV2(listParams).promise();
            if (listedObjects.Contents.length === 0) {
                return;
            }
            const deleteParams = {
                Bucket: this.S3_BUCKET_ROOT_FOLDER,
                Delete: {
                    Objects: listedObjects.Contents.map((obj) => ({
                        Key: obj.Key,
                    })),
                },
            };
            await this.s3.deleteObjects(deleteParams).promise();
            this.loggerService.log(`Folder and its contents have been deleted: ${url}`);
        }
        catch (error) {
            this.loggerService.error(`Failed to delete folder from S3: ${error.message}`);
        }
    }
    extractBucketAndKey(url) {
        this.loggerService.log(`"Extracting bucket" ${url}`);
        const matches = url.match(/https:\/\/([^\.]+)\.s3(?:\.[a-z0-9-]+)?\.amazonaws\.com\/(.+)/);
        if (!matches) {
            return { Bucket: "", Key: "" };
        }
        return { Bucket: matches[1], Key: matches[2] };
    }
    async getFileFromS3(ur) {
        const { Bucket, Key } = this.extractBucketAndKey(ur);
        const params = {
            Bucket: Bucket,
            Key: Key,
        };
        return await this.s3.getObject(params).promise();
    }
    async collectorUploadFileS3(folderPath, file, lat, lon) {
        const tempFile = tmp.fileSync({
            postfix: ".jpeg",
            discardDescriptor: true,
            keep: true,
        });
        fs.writeFileSync(tempFile.name, file.buffer);
        try {
            if (lat !== null &&
                lon !== null &&
                (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg")) {
                try {
                    await exiftool_vendored_1.exiftool.write(tempFile.name, {
                        GPSLatitude: lat,
                        GPSLatitudeRef: lat >= 0 ? "N" : "S",
                        GPSLongitude: lon,
                        GPSLongitudeRef: lon >= 0 ? "E" : "W",
                    });
                }
                catch (exifError) {
                    console.warn("EXIF write failed:", exifError.message);
                }
            }
            const updatedBuffer = fs.readFileSync(tempFile.name);
            const params = {
                Bucket: this.S3_BUCKET_ROOT_FOLDER,
                Key: `${folderPath}/${file.originalname}`,
                Body: updatedBuffer,
                ACL: "public-read",
                ContentType: file.mimetype,
                ContentDisposition: "inline",
            };
            const s3Response = await this.s3.upload(params).promise();
            tempFile.removeCallback();
            return s3Response;
        }
        catch (error) {
            tempFile.removeCallback();
            throw error;
        }
    }
    getFileNameFromUrl(fileUrl) {
        const url = new URL(fileUrl);
        const pathname = url.pathname;
        const fileName = pathname.split("/").pop();
        return fileName || "";
    }
    async getPresignedUrl(url) {
        const { Bucket, Key } = this.extractBucketAndKey(url);
        const params = {
            Bucket: Bucket,
            Key: Key,
            Expires: 60 * 5,
        };
        return await this.s3.getSignedUrlPromise("getObject", params);
    }
    async completeMultipartUpload(uploadId, key, parts) {
        const params = {
            Bucket: this.S3_BUCKET_ROOT_FOLDER,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts },
        };
        return await this.s3.completeMultipartUpload(params).promise();
    }
    async getPresignedUrlForPutObject(file, key) {
        try {
            const params = {
                Bucket: this.S3_BUCKET_ROOT_FOLDER,
                Key: key,
                ContentType: file.type,
                Expires: 3600,
            };
            return await this.s3.getSignedUrlPromise("putObject", params);
        }
        catch (error) {
            throw error;
        }
    }
    async getFolderData(baseFolder) {
        const subFolders = ["Front", "Back", "Left", "Right"];
        const allFiles = [];
        for (const folder of subFolders) {
            const prefix = `${baseFolder}/${folder}/`;
            let isTruncated = true;
            let continuationToken;
            while (isTruncated) {
                const params = {
                    Bucket: this.S3_BUCKET_ROOT_FOLDER,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                    MaxKeys: 1000,
                };
                try {
                    const data = await this.s3.listObjectsV2(params).promise();
                    if (data.Contents && data.Contents.length > 0) {
                        const files = data.Contents.filter((item) => (item.Key !== prefix &&
                            constant_type_common_1.IMAGE_EXTENSIONS.includes(item.Key.slice(item.Key.lastIndexOf(".") + 1))) ||
                            constant_type_common_1.VIDEO_EXTENSIONS.includes(item.Key.slice(item.Key.lastIndexOf(".") + 1))).map((item) => ({
                            key: item.Key,
                            size: item.Size,
                            lastModified: item.LastModified,
                        }));
                        allFiles.push(...files);
                    }
                    isTruncated = data.IsTruncated ?? false;
                    continuationToken = data.NextContinuationToken;
                }
                catch (error) {
                    console.error(`Error fetching from folder ${prefix}:`, error);
                    break;
                }
            }
        }
        return allFiles;
    }
};
exports.AWSS3Service = AWSS3Service;
exports.AWSS3Service = AWSS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_service_1.LoggerService])
], AWSS3Service);
//# sourceMappingURL=aws-s3.service.js.map