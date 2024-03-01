import express from "express";
import {
  Authenticate,
  AuthenticateCustomer,
  DtoValidationMiddleware,
} from "../../middlewares";
import { CreateBlogDTO } from "../../dtos/BlogDto";

import {
  CreateBlog,
  DeleteBlogById,
  GetBlogById,
  GetAllBlog,
  UpdateBlog,
  ReviewPost,
  GetRelativePosts,
  GetAllBlogByTag,
} from "../../controllers/BlogController";
import { PaginateResultsMiddleware } from "../../middlewares/PaginationMiddleware";
import { Blog } from "../../models";
import { ValidateObjectId } from "../../middlewares/ValidateObjectId";
import { initMulter } from "../../config";

const router = express.Router();

const imagesMiddleware = initMulter();

router.post(
  "/",
  Authenticate,
  imagesMiddleware,
  DtoValidationMiddleware(CreateBlogDTO),
  CreateBlog
);

router.patch(
  "/:id",
  ValidateObjectId,
  Authenticate,
  imagesMiddleware,
  UpdateBlog
);

router.get("/tag", GetAllBlogByTag);

router.delete("/:id", ValidateObjectId, Authenticate, DeleteBlogById);

router.get("/", PaginateResultsMiddleware(Blog), GetAllBlog);

router.get("/:id", ValidateObjectId, GetBlogById);

router.post("/:id/review", ValidateObjectId, ReviewPost);

router.get("/:id/relative-posts", ValidateObjectId, GetRelativePosts);


export { router as BlogRoutes };
