import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Middleware Error Handling");

  if (err.status === 401 && err.message === "Unauthorized") {
    const status = 401;
    const message = "Requires authentication";

    res.status(status).json({ message });

    return;
  }

  if (
    err.status === 401 &&
    err.code === "invalid_token" &&
    err.message === "Permission denied"
  ) {
    const status = 403;
    const message = err.message;

    res.status(status).json({ message });

    return;
  }

  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

