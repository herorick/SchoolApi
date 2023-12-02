import express from "express";
import { Authenticate } from "middlewares";
import { GetBanners, UpdateBanners } from "controllers/BannerController";

const router = express.Router();
router.get("/", GetBanners);
router.use(Authenticate);
router.post("/", UpdateBanners);
export { router as BannerRoutes };
