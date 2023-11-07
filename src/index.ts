import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

import { connectDB } from "config";
import {
  AdminRoutes,
  VendorRoutes,
  ProductRoutes,
  BlogCategoryRoutes,
  BlogRoutes,
  ProductCategoryRoute,
  BrandRoutes,
  CouponRoutes,
} from "routes";
import { errorHandler, notFoundHandler } from "./middlewares";


dotenv.config();
connectDB();

const app = express();
//U se gzip compression
app.use(compression());

// for parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// add logger
app.use(
  cors({
    origin: "*",
  })
);

export const uploadPath = path.join(__dirname, "/uploads/");
app.use("/uploads", express.static(uploadPath));

app.use("/admin", AdminRoutes);
app.use("/vendor", VendorRoutes);
app.use("/product", ProductRoutes);
app.use("/product-category", ProductCategoryRoute);
app.use("/blog", BlogRoutes);
app.use("/blog-category", BlogCategoryRoutes);
app.use("/brand", BrandRoutes);
app.use("/coupon", CouponRoutes)

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(8000, () => {
  console.log("App is learning port 8000");
});
