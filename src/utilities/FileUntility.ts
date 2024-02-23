import fs from "fs";
import { unlink } from "fs/promises";
import { uploadPath } from "../index";

export const removeImage = async (imageName: string) => {
  const path = uploadPath + imageName;
  if (fs.existsSync(path)) {
    await fs.unlink(path, (err: unknown) => {
      if (err) {
        return false;
      }
      return true;
    });
  }
  return false;
};

export const removeImageSync = (imageName: string) => {
  try {
    const path = uploadPath + imageName;
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

export const removeImages = async (imageNames: string[]) => {
  try {
    const promises = imageNames.map((file) => unlink(uploadPath + file));
    await Promise.all(promises);
    console.log("All files deleted successfully");
  } catch (err) {
    console.error(err);
  }
};
