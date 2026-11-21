// backend/src/routes/communityRoutes.js
import express from "express";
import { prisma } from "../config/db.js";

const router = express.Router();

// GET all profiles
router.get("/", async (_req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
    });
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

    const normalizedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const normalizedProjects = Array.isArray(projects)
      ? projects
      : typeof projects === "string"
      ? projects.split(",").map((p) => p.trim()).filter(Boolean)
      : [];

    const savedProfile = await prisma.profile.create({
      data: {
        name,
        profession,
        education: education || "",
        skills: normalizedSkills,
        projects: normalizedProjects,
        contactEmail: contactEmail || "",
        lookingFor: lookingFor || "",
      },
    });

    res.status(201).json(savedProfile);
  } catch (err) {
    console.error("Error saving community profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Search profiles
router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const term = String(q || "").toLowerCase();
    const profiles = await prisma.profile.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { profession: { contains: term, mode: "insensitive" } },
        ],
      },
    });
    res.json(profiles);
  } catch (err) {
    console.error("Error searching community profiles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
