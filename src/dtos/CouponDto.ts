import { Trim } from "class-sanitizer";
import { IsDateString, IsNumber, IsString, MinLength } from "class-validator";

export class CreateCouponDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Dode should be minimum of 5 characters" })
  code?: string;

  @IsNumber()
  discountPercentage?: Number;

  @IsNumber()
  limit?: Number;

  @IsDateString()
  expirationDate?: Date;
}
