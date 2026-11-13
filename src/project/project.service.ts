/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

  private async isCollectorCodeUnique(collectorCode: string): Promise<boolean> {
    const existing = await this.getOneProjects({
      where: { collectorCode },
    });
    return !existing;
  }

  private generateRandomCode(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  async generateCollectorCode(length = 5): Promise<string> {
    let newCode = "";
    let isUnique = false;
    while (!isUnique) {
      newCode = this.generateRandomCode(length);
      isUnique = await this.isCollectorCodeUnique(newCode);
    }
    return newCode;
  }

  private async ensureCollectorCode(project: any): Promise<string | null> {
    if (project?.collectorCode) return project.collectorCode;
    const collectorCode = await this.generateCollectorCode(5);
    await this.projectRepo.updateById(project.projectId, { collectorCode });
    return collectorCode;
  }

  async getAllProjectByEmail(userId: number) {
    const results =
      await this.admProjectUserRoleService.getProjectByUserId(userId);

    // Lazily backfill collector codes for projects created before the
    // COLLECTOR_CODE column existed (same mint-once semantics as creation).
    await Promise.all(
      results.map((projectUser) =>
        this.ensureCollectorCode(projectUser.project).then((code) => {
          projectUser.project.collectorCode = code;
        }),
      ),
    );

    return results.map((projectUser) => ({
      project: {
        projectId: projectUser.project.projectId,
        projectName: projectUser.project.projectName,
        projectNumber: projectUser.project.projectNumber,
        description: projectUser.project.projectDescription,
        collectorCode: projectUser.project.collectorCode,
        agencyName: projectUser.project.agency?.agencyName ?? "",
        agencyId: projectUser.project.agencyId,
        kmlFileUrl: projectUser.project.kmlFileUrl,
        geoJsonS3FilePath: projectUser.project.geoJsonFileUrl,
        userId: projectUser.project.userId,
        isLocked: projectUser.project.isLocked,
        isDownloaded: projectUser.project.isDownloaded,
        isActive: projectUser.project.isActive,
        dateCreated: projectUser.project.dateCreated,
        dateUpdated: projectUser.project.dateUpdated,
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

    const s3FileName = createProject.shapeFileName.replace(/^(\d+-)+/, "");
    const kmlS3Key = `${createProject.projectNumber}/${s3FileName}`;
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
      s3FileName,
      "geojson",
    );
    const geoJsonS3Key = `${createProject.projectNumber}/${fileNameWithGeoJsonExtension}`;
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

    const collectorCode = await this.generateCollectorCode(5);

    const project = await this.projectRepo.createProject({
      projectNumber: createProject.projectNumber,
      collectorCode,
      projectName: createProject.projectName,
      projectDescription: createProject.projectDescription,
      kmlFileUrl: fileResponse?.Location,
      geoJsonFileUrl: fileResponseGeoJson?.Location,
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

    if (existProject?.isDownloaded && updateProject.isLocked === false) {
      throw new BadRequestException(
        "The project data is being used by the mobile application for collection and it cannot be unlocked.",
      );
    }
    if (existProject?.isLocked && updateProject.isLocked !== false) {
      throw new BadRequestException(
        "This project is locked and cannot be edited.",
      );
    }

    if (updateProject?.shapeFileName) {
      // Delete old shape files
      await this.awsS3Service.deleteObject(existProject?.kmlFileUrl);
      await this.awsS3Service.deleteObject(existProject?.geoJsonFileUrl);

      const localKmlPath = `${UPLOAD_DIR}/${updateProject.shapeFileName}`;

      // Read and upload new shape file
      const fileData = await readFile(localKmlPath);
      const projectNumber =
        updateProject?.projectNumber ?? existProject?.projectNumber;
      const s3FileName = updateProject.shapeFileName.replace(/^(\d+-)+/, "");
      const kmlS3Key = `${projectNumber}/${s3FileName}`;
      fileResponse = await this.awsS3Service.createDirectoryORFileUpload(
        kmlS3Key,
        fileData,
      );
      console.log(
        `[update-project] KML uploaded -> key: ${kmlS3Key} | Location: ${fileResponse?.Location ?? "FAILED"}`,
      );

      // Convert KML to GeoJSON
      const { kmlGeoJson } = await convertKmlToGeoJson(fileData);

      const fileNameWithGeoJsonExtension = changeFileExtension(
        s3FileName,
        "geojson",
      );
      const geoJsonS3Key = `${projectNumber}/${fileNameWithGeoJsonExtension}`;
      fileResponseGeoJson = await this.awsS3Service.createDirectoryORFileUpload(
        geoJsonS3Key,
        kmlGeoJson,
      );
      console.log(
        `[update-project] GeoJSON uploaded -> key: ${geoJsonS3Key} | Location: ${fileResponseGeoJson?.Location ?? "FAILED"}`,
      );

      deleteFile(localKmlPath);
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
      ...(updateProject.isLocked !== undefined
        ? { isLocked: updateProject.isLocked }
        : {}),
      ...(updateProject.isDownloaded !== undefined
        ? { isDownloaded: updateProject.isDownloaded }
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

  async getCollectorCode(projectId: number) {
    const project: any = (
      await this.getAllProjects({
        where: { projectId },
      })
    )[0];
    if (!project) throw new NotFoundException("Project not found");
    const collectorCode = await this.ensureCollectorCode(project);
    return { projectId: project.projectId, collectorCode };
  }

  async checkProjectNameExists(projectName: string) {
    return this.projectRepo.checkProjectNameExists(projectName);
  }

  async checkProjectNumberExists(projectNumber: string) {
    return this.projectRepo.checkProjectNumberExists(projectNumber);
  }
}
