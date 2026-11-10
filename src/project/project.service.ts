/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ProjectRepo } from "./project.repo";
import { CreateProjectDto } from "./dto/create-project.dto";
import { AWSS3Service } from "src/aws/aws-s3.service";
import { NOMINATIM_URL, UPLOAD_DIR } from "src/common/constant.type.common";
import {
  deleteFile,
  readFile,
  convertKmlToGeoJson,
  changeFileExtension,
} from "src/common/fileUpload.common";
import { AxiosResponse } from "axios";
import * as fs from "fs";
import * as path from "path";
import { lastValueFrom } from "rxjs";
import { AdmProjectUserRoleService } from "src/adm-project-user-role/adm-project-user-role.service";
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "src/logger/logger.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
import bbox from "@turf/bbox";
import { PipelineRegionStatus } from "src/pipeline-region-status/pipeline-region-status.entity";
import { ProjectRegion } from "src/project-region/project-region.entity";

@Injectable()
export class ProjectService {
  constructor(
    private projectRepo: ProjectRepo,
    private awsS3Service: AWSS3Service,
    private readonly configService: ConfigService,
    private readonly admProjectUserRoleService: AdmProjectUserRoleService,
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
  ) {}

  async getAllProjectByEmail(userId: number) {
    const results =
      await this.admProjectUserRoleService.getProjectByUserId(userId);

    return results.map((projectUserRole) => ({
      project: {
        projectId: projectUserRole.project.projectId,
        projectName: projectUserRole.project.projectName,
        projectNumber: projectUserRole.project.projectNumber,
        isEnableLens:
          projectUserRole.project.projectRegions?.some(
            (region: ProjectRegion) =>
              region.pipelineRegionStatuses?.some(
                (status: PipelineRegionStatus) => status.lensStatus === 2,
              ),
          ) ?? false,
        isEnablePlanner:
          projectUserRole.project.projectRegions?.some(
            (region: ProjectRegion) =>
              region.pipelineRegionStatuses?.some(
                (status: PipelineRegionStatus) => status.plannerStatus === 2,
              ),
          ) ?? false,
        isEnableAnalytics:
          projectUserRole.project.projectRegions?.some(
            (region: ProjectRegion) =>
              region.pipelineRegionStatuses?.some(
                (status: PipelineRegionStatus) => status.analyticsStatus,
              ),
          ) ?? false,
        viewerEnabled:
          projectUserRole.project.projectRegions?.some(
            (region: ProjectRegion) =>
              region.pipelineRegionStatuses?.some(
                (status: PipelineRegionStatus) => status.viewerStatus === 2,
              ),
          ) ?? false,
        roadViewEnabled:
          projectUserRole.project.projectRegions?.some(
            (region: ProjectRegion) =>
              region.pipelineRegionStatuses?.some(
                (status: PipelineRegionStatus) => status.roadViewStatus === 2,
              ),
          ) ?? false,
      },
    }));
  }
  async getAllProjects(filter?: any, options?: any) {
    return await this.projectRepo.getAllProjects(filter, options);
  }

  async getOneProjects(filter?: any, options?: any) {
    return await this.projectRepo.getOneProjects(filter, options);
  }

  async downloadFile(filter?: any, options?: any) {
    const result = await this.getOneProjects(filter, options);
    if (!result || result.projectDataExportUrl === "") {
      return { url: null };
    }

    return {
      url: await this.awsS3Service.getPresignedUrl(result.projectDataExportUrl),
    };
  }

  async getAllProjectsForCollector(projectId: number, userId: number) {
    const result = await this.projectRepo.getAllProjectsForCollector(
      projectId,
      userId,
    );
    return this.extractRegionAndAreaInfo(result);
  }

  async projectDetailCount(projectId: number, userId: number) {
    const result = await this.projectRepo.getAllProjectsForCollector(
      projectId,
      userId,
    );
    return this.extractRegionAndAreaInfoCount(result);
  }

  async getAllProjectsGeoJSON(projectId: number, userId: number) {
    const result = await this.projectRepo.getAllProjectsForCollector(
      projectId,
      userId,
    );

    const formattedResult = await Promise.all(
      result.projectRegions.map(async (projectRegions) => {
        return {
          regionId: projectRegions.regionId,
          regionName: projectRegions.regionName,
          projectRegionCollectionKmls: await Promise.all(
            projectRegions.projectRegionCollectionKmls.map(
              async (collection) => ({
                regionCollectionKmlId: collection.regionCollectionKmlId,
                collectionName: collection.collectionName,
                collectionKmlGeoJson: JSON.stringify(
                  JSON.parse(
                    (
                      await this.awsS3Service.getFileFromS3(
                        collection.collectionKmlGeoJsonPath,
                      )
                    ).Body.toString("utf-8"),
                  ),
                ),
                projectRegionAreas: await Promise.all(
                  collection.projectRegionAreas.map(async (area) => ({
                    areaId: area.areaId,
                    areaName: area.areaName,
                    intervalType: area.intervalType,
                    intervalValue: area.intervalValue,
                    areaPolygonFilePath: area.areaPolygonFilePath,
                    areaGeoJson: area.areaPolygonFilePath
                      ? JSON.stringify(
                          JSON.parse(
                            (
                              await this.awsS3Service.getFileFromS3(
                                area.areaPolygonFilePath,
                              )
                            ).Body.toString("utf-8"),
                          ),
                        )
                      : null,
                    round: area.round,
                    missingGeoJson: area.missingGeoJsonPath
                      ? JSON.stringify(
                          JSON.parse(
                            (
                              await this.awsS3Service.getFileFromS3(
                                area.missingGeoJsonPath,
                              )
                            ).Body.toString("utf-8"),
                          ),
                        )
                      : null,
                  })),
                ),
              }),
            ),
          ),
        };
      }),
    );
    return formattedResult;
  }
  async getAllProjectWithSpecificField() {
    const response = await this.getAllProjects({
      where: { isActive: true },
    });
    return response.map((item: any) => ({
      projectId: item?.projectId,
      projectName: item?.projectName,
      projectNumber: item?.projectNumber,
      projectS3BucketFolderPath: item?.projectS3BucketFolderPath,
      status: item?.isActive,
    }));
  }

  async createProject(createProject: CreateProjectDto, userId?: any) {
    const geoJson = await this.getGeoJSON(
      createProject.projectCountry,
      createProject.projectStateCode,
      createProject.projectNumber,
    );
    const fileData = await readFile(
      `${UPLOAD_DIR}/${createProject.shapeFileName}`,
    );
    const fileResponse: any =
      await this.awsS3Service.createDirectoryORFileUpload(
        `${createProject.projectNumber}/${createProject.shapeFileName}`,
        fileData,
      );

    const { boundingBox, kmlGeoJson } = await convertKmlToGeoJson(fileData);
    const fileNameWithGeoJsonExtension = changeFileExtension(
      createProject.shapeFileName,
      "geojson",
    );
    const fileResponseGeoJson: any =
      await this.awsS3Service.createDirectoryORFileUpload(
        `${createProject.projectNumber}/kml-geojson-${fileNameWithGeoJsonExtension}`,
        kmlGeoJson,
      );

    deleteFile(`${UPLOAD_DIR}/${createProject.shapeFileName}`);

    const project = await this.projectRepo.createProject({
      ...createProject,
      shapeFileUrl: fileResponse.Location,
      projectS3Bucket: this.awsS3Service.S3_BUCKET_ROOT_FOLDER,
      projectS3BucketFolderPath: `${createProject.projectNumber}/`,
      boundingBox,
      geoJsonS3FilePath: geoJson.fileS3Location,
      projectKmlGeoJson: fileResponseGeoJson.Location,
      createByUserId: userId,
    });
    if (this.configService.get<number>("DEFAULT_ROLE_ID") !== 0)
      await this.admProjectUserRoleService.createProjectUserRole({
        user: userId,
        project: project.projectId,
        role: this.configService.get<number>("DEFAULT_ROLE_ID"),
      });
    return project;
  }

  async updateProject(updateProject: UpdateProjectDto) {
    let fileData;
    let fileResponse;
    let fileResponseGeoJson;
    let boundingBoxData;

    const existProject: any = (
      await this.getAllProjects({
        where: { projectId: updateProject.projectId },
      })
    )[0];

    const projectNumber =
      updateProject?.projectNumber ?? existProject?.projectNumber;
    const projectCountry =
      updateProject?.projectCountry ?? existProject?.projectCountry;
    const projectStateCode =
      updateProject?.projectStateCode ?? existProject?.projectStateCode;

    // Delete old geoJson from S3
    await this.awsS3Service.deleteObject(existProject?.geoJsonS3FilePath);

    // Get new GeoJSON for project
    const geoJson = await this.getGeoJSON(
      projectCountry,
      projectStateCode,
      projectNumber,
    );

    if (updateProject?.shapeFileName) {
      // Delete old shape files
      await this.awsS3Service.deleteObject(existProject?.shapeFileUrl);
      await this.awsS3Service.deleteObject(existProject?.projectKmlGeoJson);

      // Read and upload new shape file
      fileData = await readFile(`${UPLOAD_DIR}/${updateProject.shapeFileName}`);
      fileResponse = await this.awsS3Service.createDirectoryORFileUpload(
        `${projectNumber}/${updateProject.shapeFileName}`,
        fileData,
      );

      // Convert KML to GeoJSON and get bounding box
      const { boundingBox, kmlGeoJson } = await convertKmlToGeoJson(fileData);
      boundingBoxData = boundingBox;

      const fileNameWithGeoJsonExtension = changeFileExtension(
        updateProject.shapeFileName,
        "geojson",
      );
      fileResponseGeoJson = await this.awsS3Service.createDirectoryORFileUpload(
        `${projectNumber}/kml-geojson-${fileNameWithGeoJsonExtension}`,
        kmlGeoJson,
      );

      deleteFile(`${UPLOAD_DIR}/${updateProject.shapeFileName}`);
    }

    const { projectId, shapeFileName, ...restOfUpdateProject } = updateProject;

    // Use KML bounding box if available, otherwise fallback to geoJson bounding box
    const boundingBoxToUse = boundingBoxData ?? geoJson?.boundingBox;

    const project = await this.projectRepo.updateById(projectId, {
      ...restOfUpdateProject,
      shapeFileUrl: fileResponse?.Location,
      projectS3BucketFolderPath: `${projectNumber}/`,
      boundingBox: boundingBoxToUse,
      geoJsonS3FilePath: geoJson?.fileS3Location,
      projectKmlGeoJson: fileResponseGeoJson?.Location,
    });

    return project;
  }

  async checkProjectNumberExists(projectNumber: string) {
    return this.projectRepo.checkProjectNumberExists(projectNumber);
  }
  async updateDownloadStatus(projectId: number) {
    return this.projectRepo.updateDownloadStatus(projectId);
  }

  async updateIsActiveStatus(projectId: number, isActive: boolean) {
    return this.projectRepo.updateIsActiveStatus(projectId, isActive);
  }

  async checkProjectNameExists(projectName: string) {
    return this.projectRepo.checkProjectNameExists(projectName);
  }

  async getGeoJSON(
    country: string,
    stateCode: string,
    s3Path: string,
  ): Promise<any> {
    let url = NOMINATIM_URL;
    url = url.replace("COUNTRY", country);
    url = url.replace("STATE_CODE", stateCode);
    this.loggerService.log({ url });
    const response: AxiosResponse<any> = await lastValueFrom(
      this.httpService.get(url, {
        headers: {
          "User-Agent": "transconomy/1.0",
        },
      }),
    );
    const data = response.data;

    if (data.length === 0) {
      throw new Error("Location not found");
    }
    let boundingBox = "";
    const geojson = {
      type: "FeatureCollection",
      features: data.map((place) => {
        boundingBox = `${place.boundingbox[0]},${place.boundingbox[1]},${place.boundingbox[2]},${place.boundingbox[3]}`;
        return {
          type: "Feature",
          properties: {
            name: place.display_name,
          },
          geometry: place.geojson,
        };
      }),
    };

    // Save GeoJSON file locally
    const fileName = `geojson-${Date.now()}.geojson`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(geojson));

    // Upload the file to S3
    const fileData = fs.readFileSync(filePath);
    const s3Response: any = await this.awsS3Service.createDirectoryORFileUpload(
      `${s3Path}/${fileName}`,
      fileData,
    );

    // Delete the local file after upload
    deleteFile(filePath);
    return {
      fileS3Location: s3Response.Location,
      boundingBox: boundingBox,
    };
  }

  private async extractRegionAndAreaInfo(originalData: any) {
    return {
      details: await Promise.all(
        originalData.projectRegions.map(async (region) => ({
          regionId: region.regionId,
          regionName: region.regionName,
          projectRegionCollectionKmls: await Promise.all(
            region.projectRegionCollectionKmls.map(async (collection) => ({
              regionCollectionKmlId: collection.regionCollectionKmlId,
              collectionName: collection.collectionName,
              folderPath: `https://${this.awsS3Service.S3_BUCKET_ROOT_FOLDER}.s3.amazonaws.com/${originalData.projectS3BucketFolderPath}${region.regionCode}/Input/Media`,
              folderPathAppData: `https://${this.awsS3Service.S3_BUCKET_ROOT_FOLDER}.s3.amazonaws.com/${originalData.projectS3BucketFolderPath}${region.regionCode}/App-Data`,

              projectRegionAreas: collection.projectRegionAreas.map((area) => ({
                areaId: area.areaId,
                intervalType: area.intervalType,
                intervalValue: area.intervalValue,
                areaName: area.areaName,
              })),
            })),
          ),
        })),
      ),
      projectName: originalData.projectName,
      projectId: originalData.projectId,
      projectNumber: originalData.projectNumber,
    };
  }

  private extractRegionAndAreaInfoCount(originalData: any) {
    return {
      regionCount: originalData.projectRegions.length,
      areaCount: originalData.projectRegions.reduce((count, region) => {
        return (
          count +
          region.projectRegionCollectionKmls.reduce(
            (innerCount, collection) => {
              return innerCount + collection.projectRegionAreas.length;
            },
            0,
          )
        );
      }, 0),
    };
  }

  async updateBoundingBoxForAllProjects() {
    const projects = await this.projectRepo.getAllProjects();

    for (const project of projects) {
      if (!project.shapeFileUrl) {
        this.loggerService.warn(
          `Project ${project.projectNumber} has no KML/GeoJSON URL.`,
        );
        continue;
      }

      try {
        // Fetch file directly from URL using native fetch()
        const response = await fetch(project.shapeFileUrl);

        if (!response.ok) {
          this.loggerService.warn(
            `Failed to fetch file for project ${project.projectNumber}. Status: ${response.status}`,
          );
          continue;
        }

        const fileData = await response.text();

        if (!fileData) {
          this.loggerService.warn(
            `Empty file fetched for project ${project.projectNumber}`,
          );
          continue;
        }

        // Convert KML to GeoJSON and calculate bounding box
        const { boundingBox } = await convertKmlToGeoJson(fileData);

        if (!boundingBox) {
          this.loggerService.warn(
            `Bounding box not generated for project ${project.projectNumber}`,
          );
          continue;
        }

        await this.projectRepo.updateById(project.projectId, {
          boundingBox,
        });

        this.loggerService.log(
          `Bounding box updated for project ${project.projectNumber}`,
        );
      } catch (err) {
        this.loggerService.error(
          `Error processing project ${project.projectNumber}:`,
          err as any,
        );
      }
    }

    return { message: "Bounding box update completed" };
  }
  async updateWorkstations(
    projectId: number,
    data: { daWorkstation?: string; aiWorkstation?: string },
  ) {
    return await this.projectRepo.updateById(projectId, data);
  }
}
