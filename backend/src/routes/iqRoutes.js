import express from "express";
import fetch from "node-fetch";

const router = express.Router();
router.use(express.json());

// ✅ Free models only
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGemini(model, category, difficulty, retries = 2) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
5
  const body = {
    contents: [
      {
        parts: [
          {
            text: `Generate ONE multiple-choice question in valid JSON ONLY.
Category: ${category}
Difficulty: ${difficulty}

Return ONLY JSON in this exact structure (no markdown, no extra text):
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correct_index": 0,
  "explanation": "string"
}`,
          },
        ],
      },
    ],
  };

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const rawData = await response.json();

    // ✅ Success
    if (response.ok) {
      return { ok: true, rawData, model };
    }

    const msg = rawData?.error?.message || "";

    // ✅ 429 retry with wait
    if (response.status === 429 && attempt <= retries) {
      console.log(
        `⚠️ ${model} rate-limited. Attempt ${attempt}/${retries + 1}. Waiting 15s...`
      );
      await sleep(15000);
      continue;
    }

    // ❌ Fail (no more retries)
    return { ok: false, rawData, model, status: response.status };
  }
}

router.post("/generate-question", async (req, res) => {
  const { category, difficulty } = req.body;

  try {
    let finalResult = null;

    // ✅ Try models one by one
    for (const model of MODELS) {
      console.log("🔁 Trying model:", model);

      const result = await callGemini(model, category, difficulty, 2);
      finalResult = result;

      if (!result.ok) {
        console.log(`❌ ${model} failed:`, result.rawData?.error?.message);
        continue;
      }

      // Extract text
      let content = result.rawData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        console.log(`❌ ${model} returned no content`);
        continue;
      }

      // Remove fences
      if (content.startsWith("```")) {
        content = content.replace(/```json|```/g, "").trim();
      }

      // Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        console.log(`❌ ${model} returned invalid JSON`, content);
        continue;
      }

      // Validate
      if (
        !parsed.question ||
        !Array.isArray(parsed.options) ||
        parsed.options.length !== 4 ||
        typeof parsed.correct_index !== "number"
      ) {
        console.log(`❌ ${model} returned incomplete data`, parsed);
        continue;
      }

      // ✅ Final success response
      return res.status(200).json({
        ...parsed,
        from: "gemini",
        model,
      });
    }

    // ✅ If all models fail
    return res.status(429).json({
      success: false,
      message:
        "Gemini free quota exceeded / rate limit. Please try again later.",
      lastError: finalResult?.rawData?.error?.message || "Unknown error",
    });
  } catch (err) {
    console.error("🔥 Error generating question:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while generating question",
      error: err.message,
    });
  }
  return res.status(503).json({
  success: false,
  code: "AI_QUOTA_EXCEEDED",
  message: "🚧 IQ Tester is under update. Please try again later.",
});

});
router.get("/models", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
