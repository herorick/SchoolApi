import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => console.log("mongodb connected"))
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
};
