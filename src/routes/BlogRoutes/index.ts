import express from "express";
import { Authenticate, DtoValidationMiddleware } from "middlewares";
import { CreateBlogDTO } from "dtos/BlogDto";

import {
  CreateBlog,
  DeleteBlogById,
  GetBlogById,
  GetAllBlog,
  UpdateBlog,
} from "controllers/BlogController";
import { PaginateResultsMiddleware } from "middlewares/PaginationMiddleware";
import { Blog } from "models";
import { ValidateObjectId } from "middlewares/ValidateObjectId";

const router = express.Router();

router.post(
  "/",
  Authenticate,
  DtoValidationMiddleware(CreateBlogDTO),
  CreateBlog
);

router.patch(
  "/:id",
  ValidateObjectId,
  Authenticate,
  UpdateBlog
);

router.delete("/:id", ValidateObjectId, Authenticate, DeleteBlogById);

router.get("/", PaginateResultsMiddleware(Blog), GetAllBlog);

router.get("/:id", ValidateObjectId, GetBlogById);


export { router as BlogRoutes };
