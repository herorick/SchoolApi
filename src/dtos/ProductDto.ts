import { Trim } from "class-sanitizer";
import { IsArray, IsString, MinLength } from "class-validator";

export class CreateProductDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Name should be minimum of 5 characters" })
  name?: string;

  @IsString()
  @Trim()
  @MinLength(5, { message: "Description should be minimum of 5 characters" })
  description?: string;

  @IsString()
  price?: [number];

  @IsArray()
  productCategories?: [string];

  @IsString()
  brand?: string;
}
