import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import fs from "fs"

const productImgResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.unlinkSync(`public/images/products/${file.filename}`);
    })
  );
  next();
};
