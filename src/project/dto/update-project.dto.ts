import {
  IsOptional,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsInt,
} from "class-validator";

export class UpdateProjectDto {
  @IsInt()
  projectId: number;

  @IsString()
  projectNumber?: string;

  @IsString()
  projectName?: string;

  @IsString()
  @IsOptional()
  projectDescription?: string;

  @IsString()
  projectCountry?: string;

  @IsString()
  @IsOptional()
  projectState?: string;

  @IsString()
  @IsOptional()
  projectStateCode?: string;

  @IsString()
  shapeFileName?: string;

  @IsString()
  projectCity?: string;

  @IsString()
  projectStatus?: string;

  @IsString()
  agencyName: string;

  @IsString()
  agencyRepresentativeName?: string;

  @IsEmail()
  agencyRepresentativeEmail?: string;

  @IsPhoneNumber(null)
  agencyRepresentativePhoneNumber?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsPhoneNumber(null)
  @IsOptional()
  clientRepresentativePhoneNumber?: string;

  @IsEmail()
  @IsOptional()
  clientRepresentativeEmail?: string;

  @IsString()
  @IsOptional()
  clientRepresentativeName?: string;

  @IsString()
  @IsOptional()
  lat?: string;

  @IsString()
  @IsOptional()
  long?: string;
}

export class UpdateAdmCodeInfoDto {
  @IsInt()
  projectId: number;

  @IsString()
  projectNumber?: string;

  @IsString()
  projectName?: string;

  @IsString()
  @IsOptional()
  projectDescription?: string;

  @IsString()
  projectCountry?: string;

  @IsString()
  @IsOptional()
  projectState?: string;

  @IsString()
  @IsOptional()
  projectStateCode?: string;

  @IsString()
  shapeFileName?: string;

  @IsString()
  projectCity?: string;

  @IsString()
  projectStatus?: string;

  @IsString()
  agencyName: string;

  @IsString()
  agencyRepresentativeName?: string;

  @IsEmail()
  agencyRepresentativeEmail?: string;

  @IsPhoneNumber(null)
  agencyRepresentativePhoneNumber?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsPhoneNumber(null)
  @IsOptional()
  clientRepresentativePhoneNumber?: string;

  @IsEmail()
  @IsOptional()
  clientRepresentativeEmail?: string;

  @IsString()
  @IsOptional()
  clientRepresentativeName?: string;

  @IsString()
  @IsOptional()
  lat?: string;

  @IsString()
  @IsOptional()
  long?: string;
}
