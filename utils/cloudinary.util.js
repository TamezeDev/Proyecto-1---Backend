import cloudinary from "cloudinary";
import { CloudinaryError } from "../shared/errors/app.error.js";

const deleteImgCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new CloudinaryError(
      "[cloudinary] - It couldn't delete " + publicId,
      error.message,
    );
  }
};

export { deleteImgCloudinary };
