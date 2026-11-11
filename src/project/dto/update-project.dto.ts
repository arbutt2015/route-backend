import { IsOptional, IsString, IsInt } from "class-validator";

export class UpdateProjectDto {
  @IsInt()
  projectId: number;

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
