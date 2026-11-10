import { IsOptional, IsString, IsNotEmpty, IsInt } from "class-validator";

export class CreateRoleDto {
  @IsInt()
  @IsOptional()
  roleId: string;

  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsOptional()
  @IsString()
  roleDescription?: string;

  @IsString()
  @IsNotEmpty()
  roleCode: string;
}
