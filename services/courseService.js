import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Lesson from "../models/Lesson.js";

const getCourses = async () => {
  const courses = await Course.find({ status: "published" })
    .populate("category", "name slug")
    .populate("instructor", "name email");

  return courses;
};

const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({
    slug,
    status: "published",
  })
    .populate("category", "name slug")
    .populate("instructor", "name email");

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
};

const getCourseWithCurriculum = async (slug, instructorId = null) => {
  const query = { slug };

  if (instructorId) {
    query.instructor = instructorId;
  } else {
    query.status = "published";
  }

  const course = await Course.findOne(query)
    .populate("category", "name slug")
    .populate("instructor", "name email");

  if (!course) {
    throw new Error("Course not found");
  }

  const sections = await Section.find({
    course: course._id,
  }).sort({ order: 1 });

  const result = [];

  for (const section of sections) {
    const lessons = await Lesson.find({
      section: section._id,
    }).sort({ order: 1 });

    result.push({
      section: section.title,
      order: section.order,
      lessons: lessons.map((lesson) => ({
        id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        duration: lesson.duration,
        isPreview: lesson.isPreview,
      })),
    });
  }

  return {
    course: {
      id: course._id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      image: course.image,
      price: course.price,
      level: course.level,
      status: course.status,
    },
    curriculum: result,
  };
};

const createCourse = async ({
  title,
  description,
  image,
  category,
  price,
  level,
  instructor,
}) => {
  const course = await Course.create({
    title,
    slug: title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    description,
    image,
    category,
    instructor,
    price,
    level,
    status: "draft",
  });

  return course;
};

const getInstructorCourses = async (instructorId) => {
  const courses = await Course.find({
    instructor: instructorId,
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  return courses;
};

const getInstructorCourseBySlug = async (slug, instructorId) => {
  const course = await Course.findOne({
    slug,
    instructor: instructorId,
  })
    .populate("category", "name slug")
    .populate("instructor", "name email");

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
};

const updateInstructorCourse = async (
  slug,
  instructorId,
  {
    title,
    description,
    image,
    category,
    price,
    level,
    status,
  }
) => {
  const course = await Course.findOne({
    slug,
    instructor: instructorId,
  });

  if (!course) {
    throw new Error("Course not found");
  }

  course.title = title;
  course.description = description;
  course.image = image;
  course.category = category;
  course.price = price;
  course.level = level;
  course.status = status;

  await course.save();

  return course;
};

export {
  getCourses,
  getCourseBySlug,
  getCourseWithCurriculum,
  createCourse,
  getInstructorCourses,
  getInstructorCourseBySlug,
  updateInstructorCourse,
};