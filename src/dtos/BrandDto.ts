import { Trim } from "class-sanitizer";
import { IsString, MinLength } from "class-validator";

export class CreateBrandDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Title should be minimum of 5 characters" })
  title?: string;
}
