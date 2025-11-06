import express from "express";
const router = express.Router();
import Bug from "../models/Bug.js"; // mongoose model for bug reports

// POST /api/bugreport
router.post("/bugreport", async (req, res) => {
  const { email, bug } = req.body;

  try {
    const newBug = new Bug({ email, bug });
    await newBug.save();
    res.status(200).json({ message: "Bug reported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error reporting bug" });
  }
});

export default router;
