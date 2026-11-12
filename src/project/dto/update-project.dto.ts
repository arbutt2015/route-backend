import { IsOptional, IsString, IsInt, IsBoolean } from "class-validator";

export class UpdateProjectDto {
  @IsInt()
  projectId: number;

  @IsString()
  @IsOptional()
  projectNumber?: string;

  @IsString()
  @IsOptional()
  projectName?: string;

  @IsString()
  @IsOptional()
  projectDescription?: string;

  @IsString()
  @IsOptional()
  shapeFileName?: string;

  @IsInt()
  @IsOptional()
  agencyId?: number;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @IsBoolean()
  @IsOptional()
  isDownloaded?: boolean;
}
