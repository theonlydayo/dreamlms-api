import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyDashboard,
  enrollInCourse,
  getEnrollmentStatusController,
} from "../controllers/enrollmentController.js";

const router = express.Router();

router.get("/dashboard", protect, getMyDashboard);

router.get("/:slug", protect, getEnrollmentStatusController);

router.post("/:slug", protect, enrollInCourse);

export default router;