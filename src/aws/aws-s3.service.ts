import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from "src/common/constant.type.common";
import { LoggerService } from "src/logger/logger.service";
import { exiftool } from "exiftool-vendored";
import * as fs from "fs";
import * as tmp from "tmp";

@Injectable()
export class AWSS3Service {
  private s3: AWS.S3;
  S3_BUCKET_ROOT_FOLDER: string;
  constructor(
    private configurationService: ConfigService,
    private loggerService: LoggerService,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configurationService.get("S3_BUCKET_ACCESSKEY_ID"),
      secretAccessKey: this.configurationService.get(
        "S3_BUCKET_SECRET_ACCESS_KEY_ID",
      ),
      region: this.configurationService.get("S3_BUCKET_REGION"),
    });
    this.S3_BUCKET_ROOT_FOLDER = this.configurationService.get(
      "S3_BUCKET_ROOT_FOLDER",
    );
  }
  formatePath = (
    agencyName: string,
    projectName: string,
    clientName: string,
    date: string,
    projectUniqueId: string,
  ) => {
    return {
      agency: `${agencyName}/`,
      clientName: `${agencyName}/${clientName}/`,
      project: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/`,
      clientData: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/client-data/`,
      data: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/client-data/data/`,
      metaData: `${agencyName}/${clientName}/${date}-${projectUniqueId}-${projectName}/client-data/meta-data/`,
    };
  };

  /**
   * Creates an S3 bucket with the given name
   * @param {string}  S3_BUCKET_ROOT_FOLDER - The name of the bucket to be created
   * @returns {Promise<Object>} - A promise that resolves to the bucket's details
   */

  async createDirectoryORFileUploadOld(folderPath: string, fileData?: any) {
    try {
      const params = {
        Bucket: this.S3_BUCKET_ROOT_FOLDER,
        Key: folderPath, // Ensure the key ends with a slash to denote a folder
        Body: fileData ?? "", // If fileData is provided, it will upload the file
        ACL: "public-read", // Access control for the file
      };

      // Check if the directory exists
      const directoryExists = await this.checkDirectoryExists(folderPath);

      let result;

      if (!directoryExists) {
        // If the directory doesn't exist, upload the file or create an empty object (folder)
        result = await this.s3.upload(params).promise();
        this.loggerService.log(
          `Folder or file "${result.Key}" created successfully in bucket "${this.S3_BUCKET_ROOT_FOLDER}".`,
        );
        return { Location: result.Location }; // Return file's location
      } else {
        // If the directory already exists, log and return the folder path
        this.loggerService.log(`Folder "${folderPath}" already exists.`);
        return {
          Location: `https://${this.S3_BUCKET_ROOT_FOLDER}.s3.amazonaws.com/${folderPath}`,
        }; // Simulate S3 location format
      }
    } catch (error) {
      this.loggerService.error(
        `Error creating folder or uploading file "${folderPath}" in bucket "${this.S3_BUCKET_ROOT_FOLDER}":`,
        error,
      );
      return {}; // Return empty object on error
    }
  }

  async createDirectoryORFileUpload(folderPath: string, fileData?: any) {
    console.log(
      `[s3-upload] -> bucket: ${this.S3_BUCKET_ROOT_FOLDER} | key: ${folderPath} | body: ${fileData?.length ?? 0} bytes`,
    );
    try {
      const params = {
        Bucket: this.S3_BUCKET_ROOT_FOLDER,
        Key: folderPath, // The key can denote a file or folder path
        Body: fileData ?? "", // If fileData is provided, it will upload the file
        ACL: "public-read", // Access control for the file
      };

      // Always upload the file, replacing any existing file with the same name
      const result = await this.s3.upload(params).promise();
      this.loggerService.log(
        `File or folder "${result.Key}" uploaded/replaced successfully in bucket "${this.S3_BUCKET_ROOT_FOLDER}".`,
      );

      // Return the file's location
      return { Location: result.Location };
    } catch (error) {
      console.log(
        `[s3-upload] FAILED -> bucket: ${this.S3_BUCKET_ROOT_FOLDER} | key: ${folderPath} | code: ${error?.code ?? "unknown"} | message: ${error?.message ?? error}`,
      );
      this.loggerService.error(
        `Error creating or uploading file "${folderPath}" in bucket "${this.S3_BUCKET_ROOT_FOLDER}":`,
        error,
      );
      return {};
    }
  }
  async createEmptyFolder(folderPath: string): Promise<void> {
    const folderKey = folderPath.endsWith("/") ? folderPath : `${folderPath}/`;

    await this.s3
      .putObject({
        Bucket: this.S3_BUCKET_ROOT_FOLDER,
        Key: folderKey,
        Body: "",
      })
      .promise();
  }
  async checkDirectoryExists(directory: string) {
    try {
      // Use listObjectsV2 to check if any objects exist under the specified prefix /
      const response: any = await this.s3
        .listObjectsV2({
          Bucket: this.S3_BUCKET_ROOT_FOLDER,
          Prefix: directory,
        })
        .promise();
      // If the Contents array has length > 0, the directory exists
      return response?.Contents?.length > 0 ? true : false;
    } catch (error) {
      this.loggerService.error("Error checking directory:", error);
      return false; // Assume directory doesn't exist on error
    }
  }

  async makeFilePublic(fileKey) {
    const params = {
      Bucket: this.S3_BUCKET_ROOT_FOLDER,
      Key: fileKey, // The key (path) of the file in the S3 bucket
      ACL: "public-read", // Set the ACL to public-read to make the file accessible
    };

    try {
      await this.s3.putObjectAcl(params).promise();
    } catch (error) {
      throw error;
    }
  }

  // Complete multipart upload on S3

  async deleteObject(url: string): Promise<void> {
    if (!url) return;
    const result = this.extractBucketAndKey(url);
    if (!result?.Bucket || !result?.Key) return;
    const { Bucket, Key } = result;
    const params = {
      Bucket,
      Key,
    };

    try {
      this.loggerService.log(JSON.stringify(params));
      await this.s3.deleteObject(params).promise();
      this.loggerService.log(`Object deleted from S3: ${url}`);
    } catch (error) {
      console.log(
        `[s3-delete] FAILED -> bucket: ${Bucket} | key: ${Key} | code: ${error?.code ?? "unknown"} | message: ${error?.message ?? error}`,
      );
      this.loggerService.error(
        `Failed to delete object from S3: ${error.message}`,
      );
    }
  }
  async deleteFolder(url: string): Promise<void> {
    // Ensure the folder path has a trailing slash
    const prefix = url.endsWith("/") ? url : `${url}/`;

    // List all objects in the folder (prefix)
    const listParams = {
      Bucket: this.S3_BUCKET_ROOT_FOLDER,
      Prefix: prefix,
    };

    try {
      const listedObjects = await this.s3.listObjectsV2(listParams).promise();

      // If no objects are found, the folder is empty
      if (listedObjects.Contents.length === 0) {
        return;
      }

      // Prepare the objects to delete
      const deleteParams = {
        Bucket: this.S3_BUCKET_ROOT_FOLDER,
        Delete: {
          Objects: listedObjects.Contents.map((obj) => ({
            Key: obj.Key,
          })),
        },
      };

      // Delete the objects
      await this.s3.deleteObjects(deleteParams).promise();

      this.loggerService.log(
        `Folder and its contents have been deleted: ${url}`,
      );
    } catch (error) {
      this.loggerService.error(
        `Failed to delete folder from S3: ${error.message}`,
      );
    }
  }

  extractBucketAndKey(url: string) {
    this.loggerService.log(`"Extracting bucket" ${url}`);
    const matches = url.match(
      /https:\/\/([^\.]+)\.s3(?:\.[a-z0-9-]+)?\.amazonaws\.com\/(.+)/,
    );
    if (!matches) {
      return { Bucket: "", Key: "" };
    }
    return { Bucket: matches[1], Key: matches[2] };
  }

  async getFileFromS3(ur: string): Promise<AWS.S3.GetObjectOutput> {
    const { Bucket, Key } = this.extractBucketAndKey(ur);
    const params = {
      Bucket: Bucket,
      Key: Key,
    };

    try {
      return await this.s3.getObject(params).promise();
    } catch (error) {
      console.log(
        `[s3-get] FAILED -> bucket: ${Bucket} | key: ${Key} | code: ${error?.code ?? "unknown"} | message: ${error?.message ?? error}`,
      );
      this.loggerService.error(
        `Failed to get object from S3 (${Bucket}/${Key}):`,
        error,
      );
      throw error;
    }
  }
  async collectorUploadFileS3(
    folderPath: string,
    file: any,
    lat: number | null,
    lon: number | null,
  ) {
    const tempFile = tmp.fileSync({
      postfix: ".jpeg",
      discardDescriptor: true,
      keep: true,
    });

    fs.writeFileSync(tempFile.name, file.buffer);

    try {
      // ✅ Write EXIF metadata if GPS is present
      if (
        lat !== null &&
        lon !== null &&
        (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg")
      ) {
        try {
          await exiftool.write(tempFile.name, {
            GPSLatitude: lat,
            GPSLatitudeRef: lat >= 0 ? "N" : "S",
            GPSLongitude: lon,
            GPSLongitudeRef: lon >= 0 ? "E" : "W",
          });
        } catch (exifError) {
          console.warn("EXIF write failed:", exifError.message);
          // optionally proceed without throwing
        }
      }

      const updatedBuffer = fs.readFileSync(tempFile.name);

      const params = {
        Bucket: this.S3_BUCKET_ROOT_FOLDER,
        Key: `${folderPath}/${file.originalname}`,
        Body: updatedBuffer,
        ContentType: file.mimetype,
        ContentDisposition: "inline",
        ACL: "public-read", // Access control for the file
      };

      const s3Response = await this.s3.upload(params).promise();

      tempFile.removeCallback();
      return s3Response;
    } catch (error) {
      tempFile.removeCallback();
      throw error;
    }
  }

  getFileNameFromUrl(fileUrl: string): string {
    const url = new URL(fileUrl);
    const pathname = url.pathname;
    const fileName = pathname.split("/").pop(); // Extract the file name
    return fileName || ""; // Return file name or empty string if not found
  }
  // Generate a pre-signed URL for file download
  async getPresignedUrl(
    url: string,
    expiresInSeconds = 3600,
  ): Promise<string | null> {
    if (!url) return null;
    const { Bucket, Key } = this.extractBucketAndKey(url);
    if (!Bucket || !Key) return url;
    return await this.s3.getSignedUrlPromise("getObject", {
      Bucket,
      Key,
      Expires: expiresInSeconds,
    });
  }

  async completeMultipartUpload(
    uploadId: string,
    key: string,
    parts: { PartNumber: number; ETag: string }[],
  ) {
    const params = {
      Bucket: this.S3_BUCKET_ROOT_FOLDER,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    return await this.s3.completeMultipartUpload(params).promise();
  }
  async getPresignedUrlForPutObject(
    file: { name: string; type: string },
    key: string,
  ) {
    try {
      const params = {
        Bucket: this.S3_BUCKET_ROOT_FOLDER,
        Key: key,
        ContentType: file.type,
        Expires: 3600,
      };
      return await this.s3.getSignedUrlPromise("putObject", params);
    } catch (error) {
      throw error;
    }
  }
  async getFolderData(baseFolder: string) {
    const subFolders = ["Front", "Back", "Left", "Right"];
    const allFiles = [];

    for (const folder of subFolders) {
      const prefix = `${baseFolder}/${folder}/`;
      let isTruncated = true;
      let continuationToken: string | undefined;

      while (isTruncated) {
        const params: AWS.S3.ListObjectsV2Request = {
          Bucket: this.S3_BUCKET_ROOT_FOLDER,
          Prefix: prefix,
          ContinuationToken: continuationToken,
          MaxKeys: 1000,
        };

        try {
          const data = await this.s3.listObjectsV2(params).promise();

          if (data.Contents && data.Contents.length > 0) {
            const files = data.Contents.filter(
              (item) =>
                (item.Key !== prefix &&
                  IMAGE_EXTENSIONS.includes(
                    item.Key.slice(item.Key.lastIndexOf(".") + 1),
                  )) ||
                VIDEO_EXTENSIONS.includes(
                  item.Key.slice(item.Key.lastIndexOf(".") + 1),
                ),
            ).map((item) => ({
              key: item.Key,
              size: item.Size,
              lastModified: item.LastModified,
            }));

            allFiles.push(...files);
          }

          isTruncated = data.IsTruncated ?? false;
          continuationToken = data.NextContinuationToken;
        } catch (error) {
          console.error(`Error fetching from folder ${prefix}:`, error);
          break;
        }
      }
    }

    return allFiles;
  }
}
