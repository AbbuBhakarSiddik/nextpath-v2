// backend/src/routes/resumeRoutes.js
import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

// Use in-memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .doc and .docx files are allowed"));
  },
});

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
