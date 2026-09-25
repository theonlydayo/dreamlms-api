import express from "express";

import {
  register,
  login,
  logout,
  updateProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: {
      ...req.user,
      role: req.user.role,
    },
  });
});

router.put("/profile", protect, updateProfile);

export default router;