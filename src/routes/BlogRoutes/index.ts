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

const router = express.Router();

router.post(
  "/",
  Authenticate,
  DtoValidationMiddleware(CreateBlogDTO),
  CreateBlog
);

router.patch(
  "/:id",
  Authenticate,
  UpdateBlog
);

router.delete("/:id", Authenticate, DeleteBlogById);

router.get("/", PaginateResultsMiddleware(Blog), GetAllBlog);

router.get("/:id", GetBlogById);


export { router as BlogRoutes };
