import { IsString, IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class CreateProjectUserRoleDto {
  @IsString()
  @IsOptional()
  projectUserRoleId?: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsOptional()
  @IsString()
  cognitoId?: string;
}

export class GetUsersByProjectAndRoleIdDto {
  @IsString()
  @IsNotEmpty()
  roleCode: string;

  @IsInt()
  @IsNotEmpty()
  projectId: number;
}
