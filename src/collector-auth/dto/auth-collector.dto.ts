import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CollectorSignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectorCode: string;
}
