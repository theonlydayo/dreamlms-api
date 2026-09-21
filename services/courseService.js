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

const getCourseWithCurriculum = async (slug) => {
  const course = await Course.findOne({
    slug,
    status: "published",
  });

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
    },
    curriculum: result,
  };
};

export {
  getCourses,
  getCourseBySlug,
  getCourseWithCurriculum,
};