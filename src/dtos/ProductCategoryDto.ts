import { Trim } from "class-sanitizer";
import { IsString, MinLength } from "class-validator";

export class CreateProductCategoryDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Title should be minimum of 5 characters" })
  title?: string;

  @IsString()
  @Trim()
  @MinLength(5, { message: "Description should be minimum of 5 characters" })
  description?: string;

  @IsString()
  image?: string;
}
