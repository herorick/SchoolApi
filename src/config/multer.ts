import { Request } from "express";
import multer from "multer";
import fs from "fs";

const fileFilter = (req: Request, file: Express.Multer.File, callback: any) => {
  if (file.mimetype.split("/")[0] === "image") {
    callback(null, true);
  } else {
    callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

// const limits = {
//   files: 2,
//   fileSize: 1000000000,
// };

export const initMulter = () => {
  const imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
      fs.mkdir("./src/uploads/", (err) => {
        callback(null, "./src/uploads/");
      });
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  });
  return multer({ storage: imageStorage, fileFilter }).array("files");
};
