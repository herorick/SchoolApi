import { Trim } from "class-sanitizer";
import { IsString, MinLength, IsArray } from "class-validator";

export class CreateBlogCategoryDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Name should be minimum of 5 characters" })
  title?: string;

  @IsString()
  @Trim()
  @MinLength(5, { message: "Name should be minimum of 5 characters" })
  description?: string;
}
