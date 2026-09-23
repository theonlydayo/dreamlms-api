import uploadImage from "../services/cloudinaryService.js";

const uploadCourseImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const result = await uploadImage(req.file.buffer);

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { uploadCourseImage };