import express from "express";
import { prisma } from "../config/db.js";

const router = express.Router();

// POST /api/bugreport
router.post("/bugreport", async (req, res) => {
  const { email, bug } = req.body;

  try {
    await prisma.bugReport.create({
      data: {
        email: email || "anonymous@nextpath.ai",
        bug: bug || "Unspecified issue",
      },
    });
    res.status(200).json({ message: "Bug reported successfully" });
  } catch (error) {
    console.error("Error reporting bug:", error);
    res.status(500).json({ message: "Error reporting bug" });
  }
});

export default router;
