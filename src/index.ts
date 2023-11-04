import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import { connectDB } from "config";
import { AdminRoutes, VendorRoutes } from "routes";
import { errorHandler } from "./middlewares";
import { ProductRoutes } from "./routes/ProductRoute";

dotenv.config();
connectDB();

const app = express();

// // for parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add logger
app.use(cors({
  origin: "*"
}));


export const uploadPath = path.join(__dirname, "/uploads/")
app.use('/uploads', express.static(uploadPath));

app.use("/admin", AdminRoutes);
app.use("/vendor", VendorRoutes);
app.use("/product", ProductRoutes);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);

app.listen(8000, () => {
  console.log("App is learning port 8000");
});
