import bcrypt from "bcrypt";
import { Request } from "express";
import { AuthPayload } from "interfaces/Auth";
import { VendorPayload } from "interfaces/Vendor";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "./VariableUtility";

console.log(APP_SECRET)

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generatePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savePassword: string,
  salt: string
) => {
  return (await generatePassword(enteredPassword, salt)) === savePassword;
};

export const generateSignature = (payload: VendorPayload) => {
  return jwt.sign(payload, APP_SECRET, {
    expiresIn: "1d",
  });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET) as AuthPayload;
    // @ts-ignore
    req.user = payload;
    return true;
  }
  return false;
};
