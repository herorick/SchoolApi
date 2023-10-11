import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "interfaces/Auth";
import { validateSignature } from "utilities";
export {};

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await validateSignature(req);
  if (validate) {
    next();
  } else {
    return res.json({ message: "user not Authenticated" });
  }
};
