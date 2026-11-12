import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { CollectorService } from "./collector.service";
import { CustomAuthGuard } from "src/collector-auth/jwt-auth-collector.guard";
import { LoggerService } from "src/logger/logger.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SkipAuth } from "src/auth/skip-auth.decorator";
import { SkipRolesGuard } from "src/auth/decorator/skip-role.guard.decorator";

@UseGuards(CustomAuthGuard)
@ApiTags("Collector")
@Controller("collector")
@ApiBearerAuth("access-token")
@SkipAuth()
@SkipRolesGuard()
export class CollectorController {
  constructor(
    private readonly collectorService: CollectorService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get("get-all-project-geo-json")
  async getGEOJson(@Req() req: any, @Query("projectId") projectId: number) {
    try {
      const { projectId: tokenProjectId, collectorCode } = req.user;
      if (
        !collectorCode ||
        (projectId !== undefined &&
          Number(projectId) !== Number(tokenProjectId))
      ) {
        throw new UnauthorizedException(
          "Project is not authorized for this collector code",
        );
      }
      const response =
        await this.collectorService.getProjectGeoJson(collectorCode);

      return {
        message: "Project details",
        data: response,
        statusCode: 200,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }
}
