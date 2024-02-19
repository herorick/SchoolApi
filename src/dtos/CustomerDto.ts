import { IsEmail, IsString } from "class-validator";
import { body, validationResult } from "express-validator";

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

export const CustomSignInValidator = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").isString().withMessage("Password is required"),
];

export const CustomSignUpValidator = [
  body("email").isEmail().withMessage("Email is required"),
  body("phone").isString().withMessage("Phone is required"),
  body("password").isString().withMessage("Password is required"),
  body("firstName").isString().withMessage("First Name is required"),
  body("lastName").isString().withMessage("Last Name is required"),
];
