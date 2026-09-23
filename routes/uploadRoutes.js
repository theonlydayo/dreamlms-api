import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadCourseImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/course-image", upload.single("image"), uploadCourseImage);

export default router;