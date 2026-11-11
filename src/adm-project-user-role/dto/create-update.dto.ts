import { IsNotEmpty, IsInt, IsOptional } from "class-validator";

export class CreateProjectUserDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class DeleteProjectUserDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class GetUsersByProjectDto {
  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsInt()
  @IsOptional()
  userId?: number;
}
