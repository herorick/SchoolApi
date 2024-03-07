import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb+srv://admin1:admin1@cluster0.pnkqvxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("mongodb connected"))
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
};
