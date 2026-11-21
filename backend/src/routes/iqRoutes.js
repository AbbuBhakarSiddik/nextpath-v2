// backend/src/routes/iqRoutes.js
import express from "express";
import fetch from "node-fetch";
import { prisma } from "../config/db.js";
import { getRandomBackupQuestion } from "../data/backupQuestions.js";

const router = express.Router();
router.use(express.json());

// Free Gemini models — raced in parallel
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

// In-Memory Leaderboard Cache for High Concurrency (100+ Students)
let cachedLeaderboard = [];
let lastLeaderboardFetch = 0;
const LEADERBOARD_CACHE_TTL = 5000; // 5 seconds cache

// ── Call a single Gemini model with enhanced prompt ─────────────────────────
async function callGemini(model, category, difficulty) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  let focusHint = "";
  if (category === "dsa") {
    focusHint = "Focus on interesting data structure traps, code output tracing, recursive depth, or time/space complexity edge cases.";
  } else if (category === "error") {
    focusHint = "Focus on subtle code bugs (JavaScript, Python, C++, or SQL), closures, scope leaks, off-by-one errors, or truthy/falsy anomalies.";
  } else {
    focusHint = "Focus on clever logic riddles, probability paradoxes, deductive sequences, or mathematical game theory.";
  }

  const prompt = `You are an elite competitive coding and technical quiz master.
Generate ONE engaging, thought-provoking multiple-choice ${difficulty}-difficulty question about "${category}".
${focusHint}

Rules:
- Make the question interesting and educational (avoid cliché or boring textbook questions)
- All 4 options must be plausible and distinct
- The explanation must clearly justify why the correct answer is right and why distractors are wrong
- Return ONLY valid raw JSON — no markdown fences, no backticks, no preamble

Required JSON structure:
{
  "question": "string (can include code snippets or formatting)",
  "options": ["string", "string", "string", "string"],
  "correct_index": 0,
  "explanation": "string"
}`;

  // 4 second timeout per model call to prevent slow hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 600 },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`${model} HTTP ${response.status}: ${err?.error?.message || "unknown"}`);
    }

    const rawData = await response.json();
    let content = rawData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error(`${model} returned empty content`);

    content = content.replace(/^```[\w]*\n?/m, "").replace(/```$/m, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`${model} returned non-JSON content`);
      parsed = JSON.parse(match[0]);
    }

    if (
      typeof parsed.question !== "string" ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      typeof parsed.correct_index !== "number" ||
      parsed.correct_index < 0 ||
      parsed.correct_index > 3
    ) {
      throw new Error(`${model} returned malformed question data`);
    }

    return { ...parsed, model };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ── POST /generate-question ─────────────────────────────────────────────────
router.post("/generate-question", async (req, res) => {
  const { category = "logical", difficulty = "medium" } = req.body;

  try {
    const result = await Promise.any(
      MODELS.map((model) => callGemini(model, category, difficulty))
    );

    // Save audit log asynchronously without blocking response
    prisma.aiActivity
      .create({
        data: {
          type: "iq",
          userQuery: `${category} - ${difficulty}`,
          outputSummary: result.question.substring(0, 300),
          metadata: { model: result.model, category, difficulty },
        },
      })
      .catch(() => {});

    return res.status(200).json({ ...result, from: "gemini" });
  } catch (err) {
    console.warn(`⚠️ Gemini API unavailable (${err?.message || "rate-limited"}). Serving backup question.`);
    const backup = getRandomBackupQuestion(category, difficulty);
    return res.status(200).json({ ...backup, model: "nextpath-curated-engine" });
  }
});

// ── POST /submit-score (Save Player Score to Supabase & Update Leaderboard) ─
router.post("/submit-score", async (req, res) => {
  const {
    playerName,
    score = 0,
    total = 0,
    streak = 0,
    category = "general",
    difficulty = "medium",
    timeTaken = 0,
  } = req.body;

  const sanitizedName = String(playerName || "Anonymous Challenger").trim().slice(0, 40);
  const percentage = total > 0 ? parseFloat(((score / total) * 100).toFixed(1)) : 0;

  try {
    const entry = await prisma.quizScore.create({
      data: {
        playerName: sanitizedName,
        score: parseInt(score, 10) || 0,
        total: parseInt(total, 10) || 0,
        percentage,
        streak: parseInt(streak, 10) || 0,
        category,
        difficulty,
        timeTaken: parseInt(timeTaken, 10) || 0,
      },
    });

    // Invalidate in-memory cache to reflect new high score immediately
    lastLeaderboardFetch = 0;

    return res.status(201).json({
      success: true,
      entry: {
        id: entry.id,
        playerName: entry.playerName,
        score: entry.score,
        streak: entry.streak,
        percentage: entry.percentage,
        createdAt: entry.createdAt,
      },
    });
  } catch (err) {
    console.error("Score submission error:", err);
    return res.status(500).json({ error: "Failed to submit score" });
  }
});

// ── GET /leaderboard (Optimized for 100+ Concurrent Students) ───────────────
router.get("/leaderboard", async (_req, res) => {
  const now = Date.now();

  // Return cached result if within TTL to protect database from 100+ concurrent requests
  if (cachedLeaderboard.length > 0 && now - lastLeaderboardFetch < LEADERBOARD_CACHE_TTL) {
    return res.json(cachedLeaderboard);
  }

  try {
    const topScores = await prisma.quizScore.findMany({
      orderBy: [{ score: "desc" }, { streak: "desc" }, { createdAt: "desc" }],
      take: 30,
      select: {
        id: true,
        playerName: true,
        score: true,
        streak: true,
        total: true,
        percentage: true,
        category: true,
        difficulty: true,
        createdAt: true,
      },
    });

    cachedLeaderboard = topScores;
    lastLeaderboardFetch = now;

    return res.json(topScores);
  } catch (err) {
    console.error("Leaderboard query error:", err);
    if (cachedLeaderboard.length > 0) return res.json(cachedLeaderboard);
    return res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

// ── GET /player/:name (Retrieve Returning Player Stats from Supabase) ───────
router.get("/player/:name", async (req, res) => {
  const name = String(req.params.name || "").trim();
  if (!name) return res.status(400).json({ error: "Player name is required" });

  try {
    const records = await prisma.quizScore.findMany({
      where: {
        playerName: { equals: name, mode: "insensitive" },
      },
      orderBy: [{ score: "desc" }, { streak: "desc" }],
      take: 10,
    });

    const bestScore = records.length > 0 ? records[0].score : 0;
    const maxStreak = records.reduce((max, r) => Math.max(max, r.streak || 0), 0);
    const totalGames = records.length;

    return res.json({
      playerName: name,
      bestScore,
      maxStreak,
      totalGames,
      history: records,
    });
  } catch (err) {
    console.error("Player lookup error:", err);
    return res.status(500).json({ error: "Failed to fetch player stats" });
  }
});

export default router;
