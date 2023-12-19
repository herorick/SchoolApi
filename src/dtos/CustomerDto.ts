import { IsEmail, IsString } from "class-validator";

export class CreateCustomerDTO {
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsString()
  phone?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}
