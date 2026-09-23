import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Instructor from "../models/Instructor.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const seedInstructor = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingInstructor = await Instructor.findOne({
      email: "instructor@dreamslms.com",
    });

    if (existingInstructor) {
      console.log("Instructor already exists");
      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash("Instructor123", 10);

    await Instructor.create({
      name: "Dreams LMS Instructor",
      email: "instructor@dreamslms.com",
      password: hashedPassword,
    });

    console.log("Instructor created successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Instructor seeding failed:", error.message);
    process.exit(1);
  }
};

seedInstructor();