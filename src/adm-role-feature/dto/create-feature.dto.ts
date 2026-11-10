import { IsArray, IsBoolean, IsInt } from "class-validator";

export class FeatureDto {
  @IsInt()
  roleId: number;
  @IsInt()
  featureId: number;

  @IsBoolean()
  createPermission: boolean;

  @IsBoolean()
  readPermissions: boolean;

  @IsBoolean()
  updatePermission: boolean;

  @IsBoolean()
  deletePermissions: boolean;
}

export class CreateFeatureDto extends FeatureDto {
  @IsArray()
  features: FeatureDto[];
}
