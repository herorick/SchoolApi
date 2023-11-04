import {
  IsArray,
  IsEmail,
  IsString,
  MinLength,
  isEmail,
} from "class-validator";
import { Trim } from "class-sanitizer";

export class CreateVendorDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Name should be minimum of 5 characters" })
  name?: string;

  @IsString()
  address?: string;

  @IsString()
  phone?: string;

  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}

export class LoginVendorDTO {
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;
}

export class UpdateVendorDTO {
  @IsString()
  @Trim()
  @MinLength(5, { message: "Name should be minimum of 5 characters" })
  name?: string;

  @IsString()
  address?: string

  @IsString()
  phone?: string

}