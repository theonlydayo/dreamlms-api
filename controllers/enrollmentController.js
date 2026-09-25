import {
  getStudentDashboard,
  enrollStudent,
  getEnrollmentStatus,
} from "../services/enrollmentService.js";

const getMyDashboard = async (req, res) => {
  try {
    const data = await getStudentDashboard(req.user._id);

    res.status(200).json(data);
  } catch (error) {
    console.error("Get student dashboard error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can enroll in courses",
      });
    }

    const enrollment = await enrollStudent(
      req.user._id,
      req.params.slug
    );

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Enroll in course error:", error);

    if (error.message === "Course not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message === "You are already enrolled in this course") {
      return res.status(409).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

const getEnrollmentStatusController = async (req, res) => {
  try {
    const data = await getEnrollmentStatus(
      req.user._id,
      req.params.slug
    );

    res.status(200).json(data);
  } catch (error) {
    console.error("Get enrollment status error:", error);

    const statusCode =
      error.message === "Course not found" ? 404 : 500;

    res.status(statusCode).json({
      message: error.message,
    });
  }
};

export {
  getMyDashboard,
  enrollInCourse,
  getEnrollmentStatusController,
};