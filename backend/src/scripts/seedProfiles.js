// backend/src/scripts/seedProfiles.js
import dotenv from "dotenv";
import path from "path";
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });
import { prisma } from "../config/db.js";

const seeds = [
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

async function seed() {
  const count = await prisma.profile.count();
  console.log("Current count in Supabase:", count);
  if (count === 0) {
    for (const p of seeds) {
      await prisma.profile.create({ data: p });
    }
    console.log("✅ Seeded 3 developer showcase profiles to Supabase!");
  } else {
    console.log(`ℹ️ Supabase already has ${count} profiles.`);
  }
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
