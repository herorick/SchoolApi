import type { NextFunction, Request, RequestHandler, Response } from "express";

type Handler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
) => RequestHandler;

const asyncHandler: Handler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (e) {
    next(e);
  }
};

export { asyncHandler };
