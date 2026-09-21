import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  getCourseCurriculum,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:slug/curriculum", getCourseCurriculum);
router.get("/:slug", getSingleCourse);

export default router;