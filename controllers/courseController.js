import {
  getCourses,
  getCourseBySlug,
  getCourseWithCurriculum,
} from "../services/courseService.js";

const getAllCourses = async (req, res) => {
  try {
    const courses = await getCourses();

    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleCourse = async (req, res) => {
  try {
    const course = await getCourseBySlug(req.params.slug);

    res.status(200).json({
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);

    res.status(404).json({
      message: error.message,
    });
  }
};

const getCourseCurriculum = async (req, res) => {
  console.log("Controller started");

  try {
    const data = await getCourseWithCurriculum(req.params.slug);

    console.log("Service finished");
    console.log("Sending response");

    res.status(200).json(data);

    console.log("Response sent");
  } catch (error) {
    console.error("Controller error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  getAllCourses,
  getSingleCourse,
  getCourseCurriculum,
};