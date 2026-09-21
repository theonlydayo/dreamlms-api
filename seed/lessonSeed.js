import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Lesson from "../models/Lesson.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const seedLessons = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const course = await Course.findOne({
      slug: "react-js-development",
    });

    if (!course) {
      throw new Error("React course not found");
    }

    const sections = await Section.find({
      course: course._id,
    }).sort({ order: 1 });

    if (!sections.length) {
      throw new Error("No sections found");
    }

    await Lesson.deleteMany({
      section: { $in: sections.map((section) => section._id) },
    });

    await Lesson.insertMany([
      {
        title: "What is React?",
        description: "Learn what React is and why it is used.",
        content: "Introduction to React and its core concepts.",
        section: sections[0]._id,
        order: 1,
        duration: 10,
        isPreview: true,
      },
      {
        title: "Setting Up React",
        description: "Set up your first React development environment.",
        content: "Learn how to create and run a React application.",
        section: sections[0]._id,
        order: 2,
        duration: 15,
        isPreview: false,
      },
      {
        title: "Components",
        description: "Learn how React components work.",
        content: "Understanding reusable React components.",
        section: sections[1]._id,
        order: 1,
        duration: 20,
        isPreview: false,
      },
      {
        title: "Props",
        description: "Learn how to pass data between components.",
        content: "Understanding props and component communication.",
        section: sections[1]._id,
        order: 2,
        duration: 18,
        isPreview: false,
      },
      {
        title: "useState",
        description: "Learn how to manage state in React.",
        content: "Understanding state and the useState hook.",
        section: sections[2]._id,
        order: 1,
        duration: 25,
        isPreview: false,
      },
      {
        title: "Updating State",
        description: "Learn how to update and work with state.",
        content: "Managing state changes in React applications.",
        section: sections[2]._id,
        order: 2,
        duration: 20,
        isPreview: false,
      },
    ]);

    console.log("Lessons seeded successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Lesson seeding failed:", error.message);
    process.exit(1);
  }
};

seedLessons();