import express, { Response, Request } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import https from "https";
import fs from "fs";
import { connectDB } from "./config";
import {
  AdminRoutes,
  VendorRoutes,
  ProductRoutes,
  BlogCategoryRoutes,
  BlogRoutes,
  ProductCategoryRoute,
  BrandRoutes,
  CustomerRoutes,
  ShoppingRoutes,
  DeliveryRoutes,
} from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares";
import { BannerRoutes } from "./routes/BannerRoutes";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
console.log(path.resolve(__dirname, "../.env"));
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

const options = {
  key: fs.readFileSync(path.join(__dirname, "../cert/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../cert/cert.pem")),
};

export const uploadPath = path.join(__dirname, "/uploads/");
app.use("/uploads", express.static(uploadPath));

app.use(express.static(__dirname + "uploadPath"));

app.get("/", (req: Request, res: Response) => {
  res.json({ data: "12" });
});

app.use("/admin", AdminRoutes);
app.use("/vendor", VendorRoutes);
app.use("/product", ProductRoutes);
app.use("/product-category", ProductCategoryRoute);
app.use("/blog", BlogRoutes);
app.use("/blog-category", BlogCategoryRoutes);
app.use("/brand", BrandRoutes);
app.use("/banner", BannerRoutes);
app.use("/customer", CustomerRoutes);
app.use("/delivery", DeliveryRoutes);
app.use(ShoppingRoutes);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);
app.use(notFoundHandler);

// app.listen(process.env.PORT, () => {
//   console.log("App is learning port " + process.env.PORT);
// });

const sslServer = https.createServer(options, app);

sslServer.listen(process.env.PORT, () => {
  console.log("Secure server is listening on port " + process.env.PORT);
});
