import bcrypt from "bcryptjs";
import { Request } from "express";
import { AuthPayload } from "../interfaces/Auth";
import { VendorPayload } from "../interfaces/Vendor";
import jwt from "jsonwebtoken";
import { CustomerPayload } from "../interfaces/Customer";

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

export const generateSignature = (payload: VendorPayload | CustomerPayload) => {
  return jwt.sign(payload, "tdt_secret", { expiresIn: "90d" });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    try {
      const payload = (await jwt.verify(
        signature.split(" ")[1],
        "tdt_secret"
      )) as AuthPayload;
      req.user = payload;
      return true;
    } catch (err) {
      return false;
    }
  }
  return false;
};
