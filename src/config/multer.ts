import { Request } from "express";
import multer from "multer";
import fs from "fs";

const FILE_TYPE_MAP: any = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileFilter = (req: Request, file: Express.Multer.File, callback: any) => {
  console.log({ file });
  const isValid = FILE_TYPE_MAP[file.mimetype];
  let uploadError: Error | null = null;
  if (file.mimetype.split("/")[0] !== "image") {
    uploadError = new Error("invalid please send image type");
    callback(null, false);
  } else if (!isValid) {
    uploadError = new Error("invalid image type");
    callback(uploadError, false);
  } else {
    callback(null, true);
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
  return multer({ storage: imageStorage, fileFilter }).array("images");
};
