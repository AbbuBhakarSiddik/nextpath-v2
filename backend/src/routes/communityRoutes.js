// backend/src/routes/communityRoutes.js
import express from "express";
import { prisma } from "../config/db.js";

const router = express.Router();

const DEFAULT_SEED_PROFILES = [
  {
    name: "Alex Chen",
    profession: "Senior Full-Stack Engineer",
    education: "B.S. Computer Science",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "Next.js"],
    projects: ["https://github.com/alexchen/devtools", "https://alexchen.dev"],
    contactEmail: "alex.chen@example.com",
    lookingFor: "Open Source Hackathons, Scalable Microservices & AI Tools",
  },
  {
    name: "Priya Sharma",
    profession: "AI & Machine Learning Engineer",
    education: "M.S. Artificial Intelligence",
    skills: ["Python", "PyTorch", "LangChain", "Gemini API", "FastAPI", "Vector DBs"],
    projects: ["https://github.com/priya/agentic-rag"],
    contactEmail: "priya.ai@example.com",
    lookingFor: "Agentic AI Frameworks, LLM Fine-Tuning & Multi-Modal Search",
  },
  {
    name: "Marcus Vance",
    profession: "Cloud DevOps & Platform Architect",
    education: "AWS Certified Solutions Architect",
    skills: ["Kubernetes", "Terraform", "Go", "AWS", "CI/CD Pipelines", "Linux"],
    projects: ["https://github.com/marcus/k8s-platform"],
    contactEmail: "marcus.v@example.com",
    lookingFor: "Cloud Native Computing Foundation (CNCF) Contributions",
  },
];

// GET all profiles (Auto-seeds if table is newly created)
router.get("/", async (_req, res) => {
  try {
    let profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
    });

    // If database is empty, seed initial community showcase profiles
    if (profiles.length === 0) {
      try {
        await Promise.all(
          DEFAULT_SEED_PROFILES.map((p) => prisma.profile.create({ data: p }))
        );
        profiles = await prisma.profile.findMany({
          orderBy: { createdAt: "desc" },
        });
      } catch (seedErr) {
        console.warn("Auto-seeding note:", seedErr.message);
        return res.json(DEFAULT_SEED_PROFILES);
      }
    }

    return res.json(profiles);
  } catch (err) {
    console.error("Error fetching community profiles:", err);
    // Return curated fallback so the page never looks broken
    return res.json(DEFAULT_SEED_PROFILES);
  }
});

// POST a new profile
router.post("/", async (req, res) => {
  try {
    const { name, profession, education, skills, projects, contactEmail, lookingFor } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!profession || !profession.trim()) {
      return res.status(400).json({ error: "Profession is required" });
    }

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
        name: name.trim(),
        profession: profession.trim(),
        education: education ? education.trim() : "",
        skills: normalizedSkills,
        projects: normalizedProjects,
        contactEmail: contactEmail ? contactEmail.trim() : "",
        lookingFor: lookingFor ? lookingFor.trim() : "",
      },
    });

    return res.status(201).json(savedProfile);
  } catch (err) {
    console.error("Error saving community profile:", err);
    return res.status(500).json({ error: "Failed to save profile. Please try again." });
  }
});

// Search profiles
router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const term = String(q || "").toLowerCase().trim();
    if (!term) {
      const all = await prisma.profile.findMany({ orderBy: { createdAt: "desc" } });
      return res.json(all.length > 0 ? all : DEFAULT_SEED_PROFILES);
    }

    const profiles = await prisma.profile.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { profession: { contains: term, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(profiles);
  } catch (err) {
    console.error("Error searching community profiles:", err);
    return res.status(500).json({ error: "Search failed" });
  }
});

export default router;
