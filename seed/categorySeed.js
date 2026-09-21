import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../models/Category.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const categories = [
  {
    name: "Development",
    slug: "development",
  },
  {
    name: "Design",
    slug: "design",
  },
  {
    name: "Business",
    slug: "business",
  },
  {
    name: "Marketing",
    slug: "marketing",
  },
  {
    name: "Photography",
    slug: "photography",
  },
  {
    name: "Music",
    slug: "music",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Category.deleteMany();

    await Category.insertMany(categories);

    console.log("Categories seeded successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exit(1);
  }
};

seedCategories();