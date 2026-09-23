import Category from "../models/Category.js";
import {
  getCourses,
  getCourseBySlug,
  getCourseWithCurriculum,
  createCourse,
  getInstructorCourses,
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
  try {
    const data = await getCourseWithCurriculum(req.params.slug);

    res.status(200).json(data);
  } catch (error) {
    console.error("Controller error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const createNewCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      price,
      level,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required",
      });
    }

    const categoryDocument = await Category.findOne({
      slug: category,
    });

    if (!categoryDocument) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const course = await createCourse({
      title,
      description,
      image,
      category: categoryDocument._id,
      price: Number(price) || 0,
      level,
      instructor: req.user._id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getInstructorCourseList = async (req, res) => {
  try {
    const courses = await getInstructorCourses(req.user._id);

    res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Get instructor courses error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  getAllCourses,
  getSingleCourse,
  getCourseCurriculum,
  createNewCourse,
  getInstructorCourseList,
};