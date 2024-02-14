import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "interfaces/Auth";
import { Customer, CustomerDoc } from "models";
import { NotFound, validateSignature } from "utilities";
export { };

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      profile?: CustomerDoc;
    }
    interface Response {
      paginatedData: any;
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

export const AuthenticateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await validateSignature(req);
  if (validate) {
    const customer = req.user!;
    const profile = await Customer.findById(customer.id);
    if (!profile) {
      throw new NotFound("customer not found by id" + customer.id);
    }
    req.profile = profile;
    next();
  } else {
    return res.json({ message: "user not Authenticated" });
  }
};
