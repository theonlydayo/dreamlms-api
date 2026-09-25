import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Instructor from "../models/Instructor.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const Model =
      decoded.role === "instructor" ? Instructor : User;

    const user = await Model.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user.toObject();
    req.user.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token",
    });
  }
};

const instructorOnly = (req, res, next) => {
  if (req.user?.role !== "instructor") {
    return res.status(403).json({
      message: "Instructor access required",
    });
  }

  next();
};

export { protect, instructorOnly };