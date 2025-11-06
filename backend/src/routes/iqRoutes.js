import express from "express";
import fetch from "node-fetch";

const router = express.Router();
router.use(express.json());

router.post("/generate-question", async (req, res) => {
  const { category, difficulty } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate ONE multiple-choice question in valid JSON format for category: ${category}, difficulty: ${difficulty}.
                  Use this exact structure:
                  {
                    "question": "string",
                    "options": ["string", "string", "string", "string"],
                    "correct_index": number,
                    "explanation": "string"
                  }`,
                },
              ],
            },
          ],
        }),
      }
    );

    const rawData = await response.json();
    console.log("🔹 Gemini raw response:", JSON.stringify(rawData, null, 2));

    // Extract Gemini response text
    let content = rawData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      return res.status(500).json({ error: "Gemini returned no content", raw: rawData });
    }

    // 🔹 Strip markdown code fences if present
    if (content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    // Parse the JSON output
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("❌ Failed to parse Gemini output:", content);
      return res.status(500).json({ error: "Invalid AI response format", raw: content });
    }

    // Validate structure
    if (
      !parsed.question ||
      !Array.isArray(parsed.options) ||
      typeof parsed.correct_index !== "number"
    ) {
      return res.status(500).json({ error: "Incomplete question data from AI", raw: parsed });
    }

    res.json(parsed);
  } catch (err) {
    console.error("🔥 Error generating question:", err);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

export default router;
