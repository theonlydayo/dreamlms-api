import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const extension = path.extname(file.originalname).toLowerCase();

    if (
      file.mimetype.startsWith("image/") ||
      allowedExtensions.includes(extension)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Only JPG, JPEG, PNG and WEBP files are allowed"));
    }
  },
});

export default upload;