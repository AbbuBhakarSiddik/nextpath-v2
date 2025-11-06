import express from "express";
import fetch from "node-fetch";
import { Document, Packer, Paragraph, TextRun } from "docx";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // load .env

const router = express.Router();

// Helper to extract JSON safely
function extractJson(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/); // extract JSON block
    if (match) return JSON.parse(match[0]);
  } catch (err) {
    console.error("JSON parse error:", err);
  }
  return { have: [], need: [], courses: [], projects: [] };
}

// POST /api/jobadvisor
router.post("/", async (req, res) => {
  const { role, skills } = req.body;

  if (!role) return res.status(400).json({ error: "Job role is required" });

  try {
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI Job Requirement Advisor.
Job Role: ${role}
User Current Skills: ${skills || ""}

Return JSON format only:
{
  "have": ["list of skills user already has"],
  "need": ["list of skills user is missing"],
  "courses": ["list of recommended courses/certifications"],
  "projects": ["list of project ideas"]
}`
                }
              ]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini API error:", text);
      return res.status(500).json({ error: "Gemini API error" });
    }

    const data = await response.json();
    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanJson = extractJson(outputText);

    // Generate DOCX
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "AI Job Requirement Report", bold: true, size: 32 })],
              alignment: "center",
            }),
            new Paragraph({ text: `Job Role: ${role}`, bold: true }),
            new Paragraph({ text: `Current Skills: ${skills || "N/A"}\n` }),

            new Paragraph({ text: "✅ Skills You Have", bold: true }),
            ...cleanJson.have.map((s) => new Paragraph("• " + s)),

            new Paragraph({ text: "\n❌ Skills You Need", bold: true }),
            ...cleanJson.need.map((s) => new Paragraph("• " + s)),

            new Paragraph({ text: "\n📘 Recommended Courses", bold: true }),
            ...cleanJson.courses.map((c) => new Paragraph("• " + c)),

            new Paragraph({ text: "\n🛠 Project Ideas", bold: true }),
            ...cleanJson.projects.map((p) => new Paragraph("• " + p)),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(process.cwd(), "job_report.docx");
    fs.writeFileSync(filePath, buffer);

    res.json({ data: cleanJson, downloadUrl: "/api/jobadvisor/download" });
  } catch (err) {
    console.error("Error in /api/jobadvisor:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// GET /api/jobadvisor/download
router.get("/download", (req, res) => {
  const filePath = path.join(process.cwd(), "job_report.docx");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Report not found" });
  }
  res.download(filePath, "Job_Advisor_Report.docx");
});

export default router;
