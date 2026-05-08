import cloudinary from "../config/cloudinary.js";
import { AppError } from "../middlewares/error.middleware.js";

const uploadToCloudinary = (buffer, folder = "taskflow/posts") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(new AppError("Image upload failed.", 500));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export default uploadToCloudinary;
