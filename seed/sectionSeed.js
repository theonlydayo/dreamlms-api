import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Section from "../models/Section.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const seedSections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const course = await Course.findOne({
      slug: "react-js-development",
    });

    if (!course) {
      throw new Error("React course not found");
    }

    await Section.deleteMany({
      course: course._id,
    });

    const sections = await Section.insertMany([
      {
        title: "Introduction to React",
        course: course._id,
        order: 1,
      },
      {
        title: "React Fundamentals",
        course: course._id,
        order: 2,
      },
      {
        title: "Working with State",
        course: course._id,
        order: 3,
      },
    ]);

    console.log(`${sections.length} sections created successfully`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Section seeding failed:", error.message);
    process.exit(1);
  }
};

seedSections();