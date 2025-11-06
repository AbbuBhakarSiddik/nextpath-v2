// backend/src/routes/userRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// --- Helpers ---
function normalizeEmail(input) {
  if (!input) return "";
  return String(input).trim().toLowerCase();
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function isGmail(e) {
  return e.endsWith("@gmail.com");
}

// --- Handlers ---
// Register: save gmail if not exists
const registerHandler = async (req, res) => {
  const e = normalizeEmail(req.body.gmail || req.body.email);

  if (!e || !isValidEmail(e) || !isGmail(e)) {
    return res.status(400).json({
      message: "Please enter a valid Gmail address (e.g., name@gmail.com).",
    });
  }

  try {
    // If already exists → 409
    const exists = await User.findOne({ email: e });
    if (exists) {
      return res.status(409).json({ message: "This Gmail is already registered." });
    }

    await User.create({ email: e });
    return res.status(201).json({ message: "Gmail registered successfully." });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: "This Gmail is already registered." });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Verify: check gmail exists
const verifyHandler = async (req, res) => {
  const e = normalizeEmail(req.body.gmail || req.body.email);
  if (!e) {
    return res
      .status(400)
      .json({ success: false, message: "Gmail is required." });
  }

  try {
    const exists = await User.exists({ email: e });
    return res.json({ success: !!exists });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};

// --- Routes ---
router.post(["/register", "/users/register"], registerHandler);
router.post(["/verify", "/users/verify"], verifyHandler);

export default router;
