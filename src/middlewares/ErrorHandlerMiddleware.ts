import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is to large",
      });
    }
    if (err.code === "LIMIT_FIELD_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image",
      });
    }
  }

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

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};
