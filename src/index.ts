import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "config";
import { AdminRoutes, VendorRoutes } from "routes";
import { errorHandler } from "./middlewares";
import morgan from "morgan";
import { ProductRoutes } from "./routes/ProductRoute";

dotenv.config();
connectDB();

const app = express();

// add logger
app.use(morgan('tiny'))

/** Add body */
app.use(bodyParser.json());

/** for case x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", AdminRoutes);
app.use("/vendor", VendorRoutes);
app.use("/product", ProductRoutes)

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(errorHandler);

app.listen(8000, () => {
  console.log("App is learning port 8000");
});
