// backend/src/routes/communityRoutes.js
import express from "express";
import Community from "../models/Community.js";

const router = express.Router();

// GET all profiles
router.get("/", async (_req, res) => {
  try {
    const profiles = await Community.find({});
    res.json(profiles);
  } catch (err) {
    console.error("Error fetching community profiles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new profile
router.post("/", async (req, res) => {
  try {
    const { name, profession, education, skills, projects, contactEmail, lookingFor } = req.body;

    const newProfile = new Community({
      name,
      profession,
      education,
      skills,
      projects,
      contactEmail,
      lookingFor,
    });

    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (err) {
    console.error("Error saving community profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: search profiles
router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const profiles = await Community.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { profession: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
      ],
    });
    res.json(profiles);
  } catch (err) {
    console.error("Error searching community profiles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
