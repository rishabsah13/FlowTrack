import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { authRequired } from "../middleware/authMiddleware.js";
const router = express.Router();

// Helper to sign JWT
const signToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
  );
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan || "free",
        subscriptionStatus: user.subscriptionStatus || "inactive",
        subscriptionRazorpayOrderId: user.subscriptionRazorpayOrderId,
        subscriptionRazorpayPaymentId: user.subscriptionRazorpayPaymentId,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionRazorpayOrderId: user.subscriptionRazorpayOrderId,
        subscriptionRazorpayPaymentId: user.subscriptionRazorpayPaymentId,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/auth/me  (protected - get current user)
router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/me  (protected - update profile)
router.put("/me", authRequired, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email is used by someone else
    const existing = await User.findOne({
      email,
      _id: { $ne: req.user.userId },
    });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true, runValidators: true },
    ).select("-passwordHash");

    res.json({ user: updated });
  } catch (err) {
    console.error("Update me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
