import { Trim } from "class-sanitizer";
import { IsArray, IsEmail, IsString, MinLength } from "class-validator";

export class CreateVendorDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Name should be minimum of 5 characters" })
  name?: string;

  @IsString()
  @Trim()
  @MinLength(5, { message: "OwnerName should be minimum of 5 characters" })
  ownerName?: string;

  @IsArray()
  foodType?: [string];

  @IsString()
  pinCode?: string;

  @IsString()
  address?: string;

  @IsString()
  phone?: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}
