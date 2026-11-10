// confirm-forgot-password.dto.ts
import { IsString } from "class-validator";

export class ConfirmForgotPasswordDto {
  @IsString()
  email: string;

  @IsString()
  confirmationCode: string;

  @IsString()
  newPassword: string;
}
