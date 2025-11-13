// backend/src/controllers/resumeController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import path from "path";
import mammoth from "mammoth"; // to extract text from .docx
import dotenv from "dotenv";

dotenv.config();

console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const file = req.file;
    console.log(`📄 Uploaded file: ${file.originalname} | Type: ${file.mimetype}`);

    // Only allow doc or docx
    if (
      ![
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.mimetype)
    ) {
      return res.status(400).json({ error: "Only .doc and .docx files are allowed" });
    }

    // Extract text from .docx using Mammoth
    let extractedText = "";
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else {
      // .doc files are legacy format – handle as plain text fallback
      extractedText = file.buffer.toString("utf-8");
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(400).json({ error: "Resume text is too short or invalid." });
    }

    console.log(`✅ Extracted text length: ${extractedText.length}`);
    console.log("🚀 Sending to Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a professional resume analyst.
      Analyze the following resume text and respond in JSON format like this:
      {
        "score": <number between 0-100>,
        "strengths": ["list of strengths"],
        "weaknesses": ["list of weaknesses"],
        "improvements": ["list of suggestions for improvement"],
        "skillsToLearn": ["skills to learn or improve"]
      }

      Resume Text:
      ${extractedText}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("✅ Gemini Response:", responseText);

    // Parse Gemini JSON response safely
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (e) {
      console.warn("⚠️ Gemini did not return pure JSON. Cleaning response...");
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    if (!parsed) {
      throw new Error("Failed to parse Gemini response");
    }

    res.json(parsed);
  } catch (error) {
    console.error("❌ Error in analyzeResume:", error);
    res.status(500).json({
      error: "Resume analysis failed. Please try again later.",
      details: error.message,
    });
  }
};
