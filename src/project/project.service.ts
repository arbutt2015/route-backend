/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { ProjectRepo } from "./project.repo";
import { CreateProjectDto } from "./dto/create-project.dto";
import { AWSS3Service } from "src/aws/aws-s3.service";
import { UPLOAD_DIR } from "src/common/constant.type.common";
import {
  deleteFile,
  readFile,
  convertKmlToGeoJson,
  changeFileExtension,
} from "src/common/fileUpload.common";
import { AdmProjectUserRoleService } from "src/adm-project-user-role/adm-project-user-role.service";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { LoggerService } from "src/logger/logger.service";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectService {
  constructor(
    private projectRepo: ProjectRepo,
    private awsS3Service: AWSS3Service,
    private readonly admProjectUserRoleService: AdmProjectUserRoleService,
    private readonly admUserService: AdmUserService,
    private readonly loggerService: LoggerService,
  ) {}

  async getAllProjectByEmail(userId: number) {
    const results =
      await this.admProjectUserRoleService.getProjectByUserId(userId);

    return results.map((projectUser) => ({
      project: {
        projectId: projectUser.project.projectId,
        projectName: projectUser.project.projectName,
        projectNumber: projectUser.project.projectNumber,
        description: projectUser.project.projectDescription,
        routeCode: `RT${String(projectUser.project.projectId).padStart(4, "0")}`,
        agencyName: projectUser.project.agency?.agencyName ?? "",
        agencyId: projectUser.project.agencyId,
        kmlFileUrl: projectUser.project.kmlFileUrl,
        geoJsonS3FilePath: projectUser.project.geoJsonFileUrl,
        boundingBox: [],
        regions: [],
        projectKmlGeoJson: projectUser.project.geoJsonFileUrl,
        isEnableLens: false,
        isEnablePlanner: false,
        isEnableAnalytics: false,
        roadViewEnabled: false,
        viewerEnabled: true,
      },
      projectUserId: projectUser.userId,
    }));
  }
  async getAllProjects(filter?: any, options?: any) {
    return await this.projectRepo.getAllProjects(filter, options);
  }

  async getOneProjects(filter?: any, options?: any) {
    return await this.projectRepo.getOneProjects(filter, options);
  }

  // downloadFile removed — COLLECTED_FILE_URL column was dropped from the DB.

  async getAllProjectWithSpecificField() {
    const response = await this.getAllProjects({
      where: { isActive: true },
    });
    return response.map((item: any) => ({
      projectId: item?.projectId,
      projectName: item?.projectName,
      status: item?.isActive,
    }));
  }

  async createProject(createProject: CreateProjectDto, userId?: number) {
    const localKmlPath = `${UPLOAD_DIR}/${createProject.shapeFileName}`;
    console.log(
      `[create-project] START | userId: ${userId} | projectName: "${createProject.projectName}" | temp kml: ${localKmlPath}`,
    );

    const fileData = await readFile(localKmlPath);
    console.log(
      `[create-project] temp kml read ok | size: ${fileData?.length ?? 0} bytes`,
    );

    const kmlS3Key = `${createProject.projectNumber}/${createProject.shapeFileName}`;
    const fileResponse: any =
      await this.awsS3Service.createDirectoryORFileUpload(kmlS3Key, fileData);
    console.log(
      `[create-project] KML uploaded -> key: ${kmlS3Key} | Location: ${fileResponse?.Location ?? "FAILED"}`,
    );

    // KML is converted to GeoJSON and stored in GEOJSON_FILE_URL.
    // TODO: render this GeoJSON on the dashboard map when a project is opened
    // (deferred feature — currently the map does not load project geometry).
    const { kmlGeoJson } = await convertKmlToGeoJson(fileData);
    const fileNameWithGeoJsonExtension = changeFileExtension(
      createProject.shapeFileName,
      "geojson",
    );
    const geoJsonS3Key = `${createProject.projectNumber}/kml-geojson-${fileNameWithGeoJsonExtension}`;
    const fileResponseGeoJson: any =
      await this.awsS3Service.createDirectoryORFileUpload(
        geoJsonS3Key,
        kmlGeoJson,
      );
    console.log(
      `[create-project] GeoJSON uploaded -> key: ${geoJsonS3Key} | Location: ${fileResponseGeoJson?.Location ?? "FAILED"}`,
    );

    deleteFile(localKmlPath);
    console.log(`[create-project] temp kml deleted: ${localKmlPath}`);

    const user = await this.admUserService.getUser({ where: { userId } });

    const project = await this.projectRepo.createProject({
      projectNumber: createProject.projectNumber,
      projectName: createProject.projectName,
      projectDescription: createProject.projectDescription,
      kmlFileUrl: fileResponse.Location,
      geoJsonFileUrl: fileResponseGeoJson.Location,
      agencyId: createProject.agencyId ?? user?.agencyId ?? null,
      userId: userId ?? null,
      isActive: true,
    });
    console.log(
      `[create-project] PROJECT row inserted -> projectId: ${project?.projectId} | agencyId: ${project?.agencyId} | userId: ${project?.userId} | isActive: ${project?.isActive}`,
    );

    await this.admProjectUserRoleService.createProjectUserRole({
      projectId: project.projectId,
      userId: userId,
    });
    console.log(
      `[create-project] PROJECT_USER row inserted -> (projectId: ${project?.projectId}, userId: ${userId})`,
    );
    return project;
  }

  async updateProject(updateProject: UpdateProjectDto) {
    let fileResponse;
    let fileResponseGeoJson;

    const existProject: any = (
      await this.getAllProjects({
        where: { projectId: updateProject.projectId },
      })
    )[0];

    if (updateProject?.shapeFileName) {
      // Delete old files
      await this.awsS3Service.deleteObject(existProject?.kmlFileUrl);
      await this.awsS3Service.deleteObject(existProject?.geoJsonFileUrl);

      // Read and upload new shape file
      const fileData = await readFile(
        `${UPLOAD_DIR}/${updateProject.shapeFileName}`,
      );
      const projectNumber =
        updateProject?.projectNumber ?? existProject?.projectNumber;
      fileResponse = await this.awsS3Service.createDirectoryORFileUpload(
        `${projectNumber}/${updateProject.shapeFileName}`,
        fileData,
      );

      // Convert KML to GeoJSON
      const { kmlGeoJson } = await convertKmlToGeoJson(fileData);

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

    const project = await this.projectRepo.updateById(updateProject.projectId, {
      ...(updateProject.projectNumber
        ? { projectNumber: updateProject.projectNumber }
        : {}),
      ...(updateProject.projectName
        ? { projectName: updateProject.projectName }
        : {}),
      ...(updateProject.projectDescription !== undefined
        ? { projectDescription: updateProject.projectDescription }
        : {}),
      ...(updateProject.agencyId !== undefined
        ? { agencyId: updateProject.agencyId }
        : {}),
      kmlFileUrl: fileResponse?.Location ?? existProject?.kmlFileUrl,
      geoJsonFileUrl:
        fileResponseGeoJson?.Location ?? existProject?.geoJsonFileUrl,
      dateUpdated: new Date(),
    });

    return project;
  }

  async updateIsActiveStatus(projectId: number, isActive: boolean) {
    return this.projectRepo.updateIsActiveStatus(projectId, isActive);
  }

  async checkProjectNameExists(projectName: string) {
    return this.projectRepo.checkProjectNameExists(projectName);
  }

  async checkProjectNumberExists(projectNumber: string) {
    return this.projectRepo.checkProjectNumberExists(projectNumber);
  }
}
