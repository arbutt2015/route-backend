import { IsOptional, IsString, IsInt } from "class-validator";

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
}
