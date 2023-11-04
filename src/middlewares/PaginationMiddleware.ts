import type { NextFunction, Request, RequestHandler, Response } from "express";
import { Model, Document } from "mongoose";

interface PaginatedData<T> {
  results: T[];
  previous?: { page: number; limit: number };
  next?: { page: number; limit: number };
}

export const PaginateResultsMiddleware = <T extends Document>(model: Model<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results: PaginatedData<T> = {
      results: [],
    };
  try {
    // Count the total number of documents in the collection
    const totalDocuments = await model.countDocuments().exec();

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    if (endIndex < totalDocuments) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    // Query the database for paginated results
    results.results = await model.find().skip(startIndex).limit(limit).exec();

    res.paginatedData = results;
    next();
  } catch (error) {
    next(error);
  }
  };
};
