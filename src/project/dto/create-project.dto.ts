import { IsOptional, IsString, IsInt } from "class-validator";

export class CreateProjectDto {
  @IsString()
  projectNumber: string;

  @IsString()
  projectName: string;

  @IsString()
  @IsOptional()
  projectDescription?: string;

  @IsString()
  shapeFileName: string;

  @IsInt()
  @IsOptional()
  agencyId?: number;
}
