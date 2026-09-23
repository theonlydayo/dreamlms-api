import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Instructor from "../models/Instructor.js";

const registerUser = async (name, email, password, role) => {
  const Model = role === "instructor" ? Instructor : User;

  const existingUser = await Model.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Model.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role,
    createdAt: user.createdAt,
  };
};

const loginUser = async (email, password, role) => {
  const Model = role === "instructor" ? Instructor : User;

  const user = await Model.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role,
      createdAt: user.createdAt,
    },
  };
};

export { registerUser, loginUser };