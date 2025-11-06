// backend/src/routes/resumeRoutes.js
import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

// Memory storage for Multer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  },
});

// Route for analyzing resumes (file upload or plain text)
router.post("/analyze", (req, res) => {
  upload.single("resume")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });

    analyzeResume(req, res).catch((error) => {
      console.error("❌ Error in analyzeResume:", error);
      res.status(500).json({ error: "Resume analysis failed" });
    });
  });
});

export default router;
