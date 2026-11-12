import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectService } from "src/project/project.service";
import { AWSS3Service } from "src/aws/aws-s3.service";

@Injectable()
export class CollectorService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly aWSS3Service: AWSS3Service,
  ) {}

  async getProjectGeoJson(collectorCode: string) {
    const project = await this.projectService.getOneProjects({
      where: { collectorCode },
    });
    if (!project) {
      throw new NotFoundException(
        "Project not found for this collector code",
      );
    }

    let geoJson: any = null;
    if (project.geoJsonFileUrl) {
      geoJson = JSON.stringify(
        JSON.parse(
          (
            await this.aWSS3Service.getFileFromS3(project.geoJsonFileUrl)
          ).Body.toString("utf-8"),
        ),
      );
    }

    return {
      projectId: project.projectId,
      projectName: project.projectName,
      projectNumber: project.projectNumber,
      description: project.projectDescription,
      collectorCode: project.collectorCode,
      kmlFileUrl: project.kmlFileUrl,
      geoJsonFileUrl: project.geoJsonFileUrl,
      isLocked: project.isLocked,
      isDownloaded: project.isDownloaded,
      geoJson,
    };
  }
}
