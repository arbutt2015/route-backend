import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ProjectService } from "src/project/project.service";

@Injectable()
export class AuthCollectorService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly projectService: ProjectService,
  ) {}

  async validateProjectByCollectorCode(collectorCode: string): Promise<any> {
    const project = await this.projectService.getOneProjects({
      where: { collectorCode },
    });
    return project ?? null;
  }

  async collectorSignIn(collectorCode: string) {
    if (!collectorCode) {
      throw new BadRequestException("Collector code is required");
    }
    const project = await this.validateProjectByCollectorCode(collectorCode);
    if (!project) {
      throw new UnauthorizedException("Collector code is not authorized");
    }
    if (!project.isActive) {
      throw new UnauthorizedException("This project is inactive");
    }
    // JWT payload — the collector code identifies the project, not a user
    const payload = {
      sub: project.collectorCode,
      collectorCode: project.collectorCode,
      projectId: project.projectId,
      projectNumber: project.projectNumber,
    };
    return {
      access_token: await this.generateAccessToken(payload),
      project: {
        projectId: project.projectId,
        projectName: project.projectName,
        projectNumber: project.projectNumber,
        collectorCode: project.collectorCode,
        geoJsonS3FilePath: project.geoJsonFileUrl,
        isLocked: project.isLocked,
        isDownloaded: project.isDownloaded,
      },
    };
  }

  async generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("AWS_COGNITO_CLIENT_SECRET"),
      expiresIn: "7d",
    });
  }

  async generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("AWS_COGNITO_CLIENT_SECRET"),
      expiresIn: "7d",
    });
  }

  async validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>("AWS_COGNITO_CLIENT_SECRET"),
      });
    } catch (error) {
      return null;
    }
  }
}
