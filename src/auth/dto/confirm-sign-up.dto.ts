// confirm-signup.dto.ts
import { IsString } from "class-validator";

export class ConfirmSignUpDto {
  @IsString()
  email: string;

  @IsString()
  confirmationCode: string;
}
