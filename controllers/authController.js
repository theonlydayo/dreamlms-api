import User from "../models/User.js";
import Instructor from "../models/Instructor.js";
import { registerUser, loginUser } from "../services/authService.js";

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and account type are required",
      });
    }

    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account type",
      });
    }

    const user = await registerUser(
      name,
      email,
      password,
      role
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and account type are required",
      });
    }

    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account type",
      });
    }

    const result = await loginUser(email, password, role);

    res.cookie("accessToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.gender = gender ?? user.gender;
    user.bio = bio ?? user.bio;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "student",
        phone: user.phone,
        gender: user.gender,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};

export { register, login, logout, updateProfile };