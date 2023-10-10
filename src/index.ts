import express from "express";

const app = express();

app.use("/", (req, res) => {
  return res.json("Hello from food Order");
});

app.listen(8000, () => {
  console.log("App is learning port 8000");
});
