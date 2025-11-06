// src/routes/chatRoutes.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ✅ Use environment variable for API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Load Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");


// Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await model.generateContent(message);
    const aiResponse = result.response.text();

    res.json({ reply: aiResponse });
  } catch (error) {
  console.error("❌ Full Gemini API Error:", error);

  if (error.response) {
    try {
      const details = await error.response.text();
      console.error("Gemini API Response Body:", details);
    } catch {}
  }
    res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

export default router;
