import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const getStudentDashboard = async (studentId) => {
  const [
    enrollments,
    enrolledCourses,
    inProgressCourses,
    completedCourses,
    certificates,
  ] = await Promise.all([
    Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: [
          {
            path: "category",
            select: "name slug",
          },
          {
            path: "instructor",
            select: "name",
          },
        ],
      })
      .sort({ enrolledAt: -1 })
      .limit(3),

    Enrollment.countDocuments({
      student: studentId,
    }),

    Enrollment.countDocuments({
      student: studentId,
      progress: { $gt: 0, $lt: 100 },
    }),

    Enrollment.countDocuments({
      student: studentId,
      progress: 100,
    }),

    Enrollment.countDocuments({
      student: studentId,
      certificateIssued: true,
    }),
  ]);

  const courses = enrollments.map((enrollment) => ({
    id: enrollment._id,
    progress: enrollment.progress,
    enrolledAt: enrollment.enrolledAt,
    course: enrollment.course,
  }));

  return {
    stats: {
      enrolledCourses,
      inProgressCourses,
      completedCourses,
      certificates,
    },
    courses,
  };
};

const enrollStudent = async (studentId, slug) => {
  const course = await Course.findOne({
    slug,
    status: "published",
  });

  if (!course) {
    throw new Error("Course not found");
  }

  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: course._id,
  });

  if (existingEnrollment) {
    throw new Error("You are already enrolled in this course");
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: course._id,
    progress: 0,
    certificateIssued: false,
  });

  return enrollment;
};

const getEnrollmentStatus = async (studentId, slug) => {
  const course = await Course.findOne({
    slug,
    status: "published",
  });

  if (!course) {
    throw new Error("Course not found");
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: course._id,
  });

  return {
    enrolled: Boolean(enrollment),
    enrollment,
  };
};

export {
  getStudentDashboard,
  enrollStudent,
  getEnrollmentStatus,
};