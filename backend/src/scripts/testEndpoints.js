// backend/src/scripts/testEndpoints.js
import dotenv from "dotenv";
import path from "path";
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });
import { prisma } from "../config/db.js";
import { generateContentWithFallback } from "../config/gemini.js";

async function testAll() {
  console.log("1. Testing Prisma Community read...");
  try {
    const profiles = await prisma.profile.findMany();
    console.log(`✅ Profiles count: ${profiles.length}`);
  } catch (err) {
    console.error("❌ Prisma Community read failed:", err.message);
  }

  console.log("\n2. Testing JobAdvisor Gemini call...");
  try {
    const prompt = `You are an AI Job Requirement Advisor.
Job Role: React Developer
User Current Skills: HTML, CSS

Return JSON format only:
{
  "have": ["HTML", "CSS"],
  "need": ["React", "JavaScript", "Redux"],
  "courses": ["Meta React Developer"],
  "projects": ["Todo App"]
}`;
    const res = await generateContentWithFallback(prompt);
    console.log("✅ JobAdvisor Gemini Response length:", res.text.length);
    console.log("Sample:", res.text.substring(0, 100));
  } catch (err) {
    console.error("❌ JobAdvisor Gemini call failed:", err.message);
  }
}

testAll().finally(() => prisma.$disconnect());
