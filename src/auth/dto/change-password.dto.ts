import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({ format: "password", maxLength: 256 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  previousPassword: string;

  @ApiProperty({ format: "password", minLength: 8, maxLength: 256 })
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])\S+$/, {
    message:
      "New password must contain uppercase, lowercase, number and special characters without spaces.",
  })
  proposedPassword: string;
}
