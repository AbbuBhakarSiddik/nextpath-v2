// backend/src/routes/jobAdvisorRoutes.js
import express from "express";
import { Document, Packer, Paragraph, TextRun } from "docx";
import dotenv from "dotenv";
import { prisma } from "../config/db.js";
import { generateContentWithFallback } from "../config/gemini.js";

dotenv.config();

const router = express.Router();

// Fallback curated roadmaps by general category to ensure zero downtime
const FALLBACK_ROADMAPS = {
  ai: {
    have: ["Python basics", "Linear algebra fundamentals", "Git"],
    need: ["PyTorch / TensorFlow", "LangChain & Agentic Frameworks", "Vector Databases (Pinecone/pgvector)", "Model Fine-Tuning & Evaluation"],
    courses: ["DeepLearning.AI: Generative AI Specialization", "Hugging Face NLP Course (Free)", "Stanford CS229: Machine Learning"],
    projects: ["Multi-Agent Research Assistant with RAG", "Custom Fine-Tuned Domain LLM with LoRA", "Autonomous Code Review GitHub Action"],
  },
  cloud: {
    have: ["Linux command line", "Networking basics (DNS/IP)", "Git version control"],
    need: ["Kubernetes (K8s) Cluster Architecture", "Terraform / Infrastructure as Code", "CI/CD Pipelines (GitHub Actions)", "Cloud Monitoring & Observability"],
    courses: ["AWS Certified Solutions Architect Associate", "Certified Kubernetes Administrator (CKA)", "Google Cloud Professional Cloud Architect"],
    projects: ["Multi-Region Kubernetes Microservices Cluster", "Automated Zero-Downtime Blue/Green Deployment Pipeline", "Production Terraform IaC for Scalable Web App"],
  },
  fullstack: {
    have: ["JavaScript / TypeScript", "HTML5 & CSS3", "Basic SQL / PostgreSQL", "REST APIs"],
    need: ["Next.js / Server Components", "Modern State Architecture", "Docker Containerization", "Prisma / Drizzle ORM", "System Design & Caching (Redis)"],
    courses: ["Full Stack Open (University of Helsinki)", "Epic React by Kent C. Dodds", "ByteByteGo: System Design Interview"],
    projects: ["Real-time Collaborative Whiteboard / Notion Clone", "High-Throughput SaaS with Stripe & Webhooks", "Distributed Task Queue Worker Service"],
  },
};

// Helper to extract JSON safely from Gemini output
function extractJson(text, role = "") {
  try {
    let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed.have) && Array.isArray(parsed.need)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("JSON parse attempt in JobAdvisor failed, falling back to smart defaults:", err.message);
  }

  // Smart heuristic fallback based on role keywords
  const r = role.toLowerCase();
  if (r.includes("ai") || r.includes("ml") || r.includes("data") || r.includes("intelligence")) {
    return FALLBACK_ROADMAPS.ai;
  }
  if (r.includes("devops") || r.includes("cloud") || r.includes("kubernetes") || r.includes("platform")) {
    return FALLBACK_ROADMAPS.cloud;
  }
  return FALLBACK_ROADMAPS.fullstack;
}

// POST /api/jobadvisor — Generate Strategic Career Gap Roadmap
router.post("/", async (req, res) => {
  const { role, skills } = req.body;

  if (!role || !role.trim()) {
    return res.status(400).json({ error: "Job role is required" });
  }

  const roleName = role.trim();
  const currentSkills = (skills || "").trim() || "Foundational / General Tech Skills";

  try {
    const prompt = `You are NextPath AI Job Requirement Advisor & Senior Career Strategist.
Target Role: "${roleName}"
Candidate's Current Skills: "${currentSkills}"

Analyze modern industry requirements for this role (FAANG, top tech startups, enterprise).
Return a valid JSON object ONLY with no extra prose:
{
  "have": ["List 2-4 relevant skills the candidate already possesses or foundational equivalents"],
  "need": ["List 4-5 prioritized critical missing skills, libraries, and architecture paradigms to learn"],
  "courses": ["Top 3 recommended industry certifications, free docs, or structured courses"],
  "projects": ["3 high-impact real-world portfolio project concepts with clear technical specifications to prove competency"]
}`;

    let cleanJson = null;

    try {
      const { text: outputText } = await generateContentWithFallback(prompt, {
        generationConfig: { temperature: 0.5, maxOutputTokens: 1200 },
      });
      cleanJson = extractJson(outputText, roleName);
    } catch (aiErr) {
      console.warn("AI generation note, using intelligent fallback roadmap:", aiErr.message);
      cleanJson = extractJson("", roleName);
    }

    // Save to database via Prisma (non-blocking)
    prisma.aiActivity
      .create({
        data: {
          type: "jobadvisor",
          userQuery: `${roleName} | Skills: ${currentSkills}`,
          outputSummary: `Need: ${(cleanJson.need || []).slice(0, 5).join(", ")}. Courses: ${(cleanJson.courses || []).slice(0, 3).join(", ")}`,
          fullOutput: cleanJson,
          metadata: { role: roleName },
        },
      })
      .catch(() => {});

    return res.json({
      success: true,
      data: cleanJson,
      role: roleName,
    });
  } catch (err) {
    console.error("Error in /api/jobadvisor:", err);
    return res.status(500).json({ error: err.message || "Failed to generate job analysis" });
  }
});

// POST /api/jobadvisor/download — Stream DOCX report from memory (Zero disk writes, 100% Vercel safe)
router.post("/download", async (req, res) => {
  const { role = "Career", skills = "", data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Analysis data is required for report download" });
  }

  try {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "NextPath.ai — Career Requirement & Skill Gap Report",
                  bold: true,
                  size: 32,
                  color: "00B074",
                }),
              ],
              alignment: "center",
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Target Job Role: ", bold: true }),
                new TextRun({ text: `${role}\n` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Candidate Starting Skills: ", bold: true }),
                new TextRun({ text: `${skills || "Foundational / General"}\n\n` }),
              ],
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [new TextRun({ text: "✅ Skills You Already Have", bold: true, size: 24 })],
              spacing: { before: 200, after: 100 },
            }),
            ...(data.have || []).map((s) => new Paragraph({ text: `• ${s}` })),

            new Paragraph({
              children: [new TextRun({ text: "❌ High-Priority Skills Needed", bold: true, size: 24 })],
              spacing: { before: 200, after: 100 },
            }),
            ...(data.need || []).map((s) => new Paragraph({ text: `• ${s}` })),

            new Paragraph({
              children: [new TextRun({ text: "📘 Recommended Learning & Certifications", bold: true, size: 24 })],
              spacing: { before: 200, after: 100 },
            }),
            ...(data.courses || []).map((c) => new Paragraph({ text: `• ${c}` })),

            new Paragraph({
              children: [new TextRun({ text: "🛠 High-Impact Portfolio Project Concepts", bold: true, size: 24 })],
              spacing: { before: 200, after: 100 },
            }),
            ...(data.projects || []).map((p) => new Paragraph({ text: `• ${p}` })),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="NextPath_${encodeURIComponent(role.replace(/[^a-zA-Z0-9]/g, "_"))}_Report.docx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    return res.send(buffer);
  } catch (err) {
    console.error("Error generating DOCX download:", err);
    return res.status(500).json({ error: "Failed to generate report file" });
  }
});

export default router;
