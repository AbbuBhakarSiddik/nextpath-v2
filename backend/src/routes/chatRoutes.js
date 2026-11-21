// backend/src/routes/chatRoutes.js
import express from "express";
import { getGeminiModel } from "../config/gemini.js";
import { prisma } from "../config/db.js";

const router = express.Router();

const systemInstruction = {
  parts: [
    {
      text: `You are NextPath.ai, an expert Career Advisor AI assistant.

Your job is to help users with:
- Career guidance and planning
- Interview preparation and tech insights
- Skills and course recommendations
- Job search strategies
- Industry insights

Formatting rules (IMPORTANT — always follow these):
- Use **bold** for key terms, job titles, and important points
- Use bullet points (- item) for lists of tips, skills, or options
- Use numbered lists (1. item) for step-by-step processes
- Use headings (## Heading) to separate major sections when the response is long
- Use inline code for technical terms, tools, or technologies
- Keep paragraphs short and scannable
- Never write a wall of text — always break up content

Be encouraging, concise, and actionable.`,
    },
  ],
  role: "system",
};

const model = getGeminiModel({ systemInstruction });

// In-memory cache
const chatCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

function sendEvent(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// ── Streaming endpoint ──────────────────────────────────────────
router.post("/stream", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders();

    // Keep-alive ping every 15s
    const keepAlive = setInterval(() => res.write(": ping\n\n"), 15000);
    req.on("close", () => clearInterval(keepAlive));

    // ── Cache hit: buffer 4 lines then stream rest ──────────────
    const cacheKey = message.trim().toLowerCase();
    if (chatCache.has(cacheKey)) {
      const cached = chatCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        const lines = cached.reply.split("\n");
        const bufferPart = lines.slice(0, 4).join("\n");
        const streamPart = lines.slice(4).join("\n");

        await new Promise((r) => setTimeout(r, 600));
        sendEvent(res, { chunk: bufferPart });

        if (streamPart) {
          for (const word of streamPart.split(" ")) {
            sendEvent(res, { chunk: word + " " });
            await new Promise((r) => setTimeout(r, 12));
          }
        }

        clearInterval(keepAlive);
        sendEvent(res, { done: true });
        return res.end();
      }
      chatCache.delete(cacheKey);
    }

    // ── Live Gemini stream ──────────────────────────────────────
    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 2048 },
    });

    const result = await chat.sendMessageStream(message);

    let fullReply = "";
    let buffer = "";
    let bufferSent = false;

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (!text) continue;

      fullReply += text;

      if (!bufferSent) {
        buffer += text;
        // Count non-empty lines so far
        const nonEmptyLines = buffer
          .split("\n")
          .filter((l) => l.trim().length > 0).length;

        if (nonEmptyLines >= 4) {
          // Flush buffer as one chunk after tiny delay for effect
          await new Promise((r) => setTimeout(r, 300));
          sendEvent(res, { chunk: buffer });
          buffer = "";
          bufferSent = true;
        }
        // else: keep buffering — frontend shows typing dots
      } else {
        // Stream every chunk immediately after buffer is flushed
        sendEvent(res, { chunk: text });
      }
    }

    // Short response that never hit 4 lines — flush whatever buffered
    if (!bufferSent && buffer) {
      await new Promise((r) => setTimeout(r, 300));
      sendEvent(res, { chunk: buffer });
    }

    clearInterval(keepAlive);
    sendEvent(res, { done: true });
    res.end();

    // Save to cache and Prisma non-blocking
    chatCache.set(cacheKey, { reply: fullReply, timestamp: Date.now() });
    prisma.aiActivity
      .create({
        data: {
          type: "chat",
          userQuery: message.substring(0, 200),
          outputSummary: fullReply.substring(0, 500),
          fullOutput: { reply: fullReply },
        },
      })
      .catch(() => {});

  } catch (error) {
    console.error("❌ Gemini Streaming Error:", error);
    try {
      sendEvent(res, { error: "Something went wrong. Please try again." });
      res.end();
    } catch (_) {}
  }
});

// ── Non-streaming fallback ──────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const cacheKey = message.trim().toLowerCase();
    if (chatCache.has(cacheKey)) {
      const cached = chatCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({ reply: cached.reply, cached: true });
      }
      chatCache.delete(cacheKey);
    }

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 2048 },
    });

    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();

    chatCache.set(cacheKey, { reply: aiResponse, timestamp: Date.now() });
    RecentOutput.create({
      type: "chat",
      userQuery: message.substring(0, 200),
      outputSummary: aiResponse.substring(0, 500),
      fullOutput: { reply: aiResponse },
    }).catch((err) => console.error("Failed to save recent output:", err));

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

export default router;
