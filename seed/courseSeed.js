import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Category from "../models/Category.js";
import Instructor from "../models/Instructor.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const instructor = await Instructor.findOne({
      email: "instructor@dreamslms.com",
    });

    if (!instructor) {
      throw new Error("No instructor found");
    }

    const categories = await Category.find();

    if (!categories.length) {
      throw new Error("No categories found");
    }

    const development = categories.find(
      (category) => category.slug === "development"
    );

    const design = categories.find(
      (category) => category.slug === "design"
    );

    const business = categories.find(
      (category) => category.slug === "business"
    );

    const marketing = categories.find(
      (category) => category.slug === "marketing"
    );

    const courses = [
      {
        title: "React JS Development",
        slug: "react-js-development",
        description:
          "Learn how to build modern web applications using React and JavaScript.",
        image: "/images/course-1.jpg",
        category: development._id,
        instructor: instructor._id,
        price: 25000,
        level: "Beginner",
        status: "published",
      },
      {
        title: "UI/UX Design Fundamentals",
        slug: "ui-ux-design-fundamentals",
        description:
          "Learn the fundamentals of user interface and user experience design.",
        image: "/images/course-2.jpg",
        category: design._id,
        instructor: instructor._id,
        price: 20000,
        level: "Beginner",
        status: "published",
      },
      {
        title: "JavaScript Essentials",
        slug: "javascript-essentials",
        description:
          "Master the core concepts of JavaScript and build a strong foundation for web development.",
        image: "/images/course-3.jpg",
        category: development._id,
        instructor: instructor._id,
        price: 18000,
        level: "Beginner",
        status: "published",
      },
      {
        title: "Digital Marketing Masterclass",
        slug: "digital-marketing-masterclass",
        description:
          "Learn practical digital marketing strategies for growing modern businesses.",
        image: "/images/course-4.jpg",
        category: marketing._id,
        instructor: instructor._id,
        price: 30000,
        level: "Intermediate",
        status: "published",
      },
      {
        title: "Business Management",
        slug: "business-management",
        description:
          "Develop essential business management skills for today's competitive environment.",
        image: "/images/course-5.jpg",
        category: business._id,
        instructor: instructor._id,
        price: 28000,
        level: "Intermediate",
        status: "published",
      },
    ];

    await Course.deleteMany();
    await Course.insertMany(courses);

    console.log("Courses seeded successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Course seeding failed:", error.message);
    process.exit(1);
  }
};

seedCourses();