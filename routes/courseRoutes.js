import express from "express";

import {
  protect,
  instructorOnly,
} from "../middleware/authMiddleware.js";

import {
  getAllCourses,
  getSingleCourse,
  getCourseCurriculum,
  getInstructorCoursePreview,
  getInstructorCourse,
  createNewCourse,
  updateCourse,
  getInstructorCourseList,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getAllCourses);

router.get(
  "/instructor",
  protect,
  instructorOnly,
  getInstructorCourseList
);

router.get(
  "/instructor/:slug/preview",
  protect,
  instructorOnly,
  getInstructorCoursePreview
);

router.get(
  "/instructor/:slug",
  protect,
  instructorOnly,
  getInstructorCourse
);

router.put(
  "/instructor/:slug",
  protect,
  instructorOnly,
  updateCourse
);

router.get("/:slug/curriculum", getCourseCurriculum);

router.get("/:slug", getSingleCourse);

router.post("/", protect, instructorOnly, createNewCourse);

export default router;