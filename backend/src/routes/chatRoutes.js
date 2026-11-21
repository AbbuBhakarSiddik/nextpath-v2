// backend/src/routes/chatRoutes.js
import express from "express";
import { getGeminiModel } from "../config/gemini.js";
import { prisma } from "../config/db.js";

const router = express.Router();

const PERSONA_CONTEXTS = {
  architect: "Persona: Staff / Principal Systems Architect. Emphasize distributed systems, high availability, resilience, clean architectural patterns, trade-offs, and technical leadership.",
  recruiter: "Persona: FAANG & Tier-1 Tech Recruiter / Career Strategist. Focus on resume impact metrics (Google X-Y-Z formula), hiring bar expectations, interview loops, leveling, and negotiation.",
  founder: "Persona: Y Combinator / Tech Startup Founder & CTO. Focus on rapid execution, 0-to-1 building, full-stack pragmatism, product velocity, and startup equity/ownership.",
  junior: "Persona: Patient Senior Developer Mentor. Focus on breaking complex ideas into clear mental models, beginner-friendly roadmaps, debugging best practices, and encouraging tone.",
};

const systemInstruction = {
  parts: [
    {
      text: `You are NextPath.ai, an elite Career Advisor & Technical Mentor AI assistant.

Your mission:
- Career guidance, transitions, and personalized roadmaps
- Technical interview prep (System Design, Coding, Behavioral)
- Industry skill gap analysis and certification advice
- Resume review and positioning for high-tier tech roles

Formatting rules (Always adhere to these):
- Use **bold** for key concepts, technologies, and high-impact actions
- Use structured bullet points (- item) for lists
- Use numbered lists (1. item) for sequential steps or roadmaps
- Use headings (## Heading) to organize major sections
- Use \`code spans\` for libraries, CLI commands, and tech tools
- When providing code, use markdown code blocks (\`\`\`language ... \`\`\`)
- Keep paragraphs punchy and easy to scan on both mobile and desktop screens
- Be encouraging, precise, and actionable.`,
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
    const { message, persona = "architect" } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const personaInstruction = PERSONA_CONTEXTS[persona] || PERSONA_CONTEXTS.architect;
    const promptWithPersona = `[Directive: ${personaInstruction}]\n\nUser Question: ${message.trim()}`;

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
    const cacheKey = `${persona}:${message.trim().toLowerCase()}`;
    if (chatCache.has(cacheKey)) {
      const cached = chatCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        const lines = cached.reply.split("\n");
        const bufferPart = lines.slice(0, 4).join("\n");
        const streamPart = lines.slice(4).join("\n");

        await new Promise((r) => setTimeout(r, 400));
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
      generationConfig: { maxOutputTokens: 2048, temperature: 0.65 },
    });

    const result = await chat.sendMessageStream(promptWithPersona);

    let fullReply = "";
    let buffer = "";
    let bufferSent = false;

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (!text) continue;

      fullReply += text;

      if (!bufferSent) {
        buffer += text;
        const nonEmptyLines = buffer
          .split("\n")
          .filter((l) => l.trim().length > 0).length;

        if (nonEmptyLines >= 3) {
          await new Promise((r) => setTimeout(r, 200));
          sendEvent(res, { chunk: buffer });
          buffer = "";
          bufferSent = true;
        }
      } else {
        sendEvent(res, { chunk: text });
      }
    }

    // Flush any leftover buffer
    if (!bufferSent && buffer) {
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
          fullOutput: { reply: fullReply, persona },
          metadata: { persona },
        },
      })
      .catch(() => {});
  } catch (error) {
    console.error("❌ Gemini Streaming Error in /api/chat/stream:", error);
    try {
      sendEvent(res, {
        error: "Advisor service briefly unavailable. Please try again or switch persona.",
      });
      res.end();
    } catch (_) {}
  }
});

// ── Non-streaming fallback ──────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { message, persona = "architect" } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const personaInstruction = PERSONA_CONTEXTS[persona] || PERSONA_CONTEXTS.architect;
    const promptWithPersona = `[Directive: ${personaInstruction}]\n\nUser Question: ${message.trim()}`;

    const cacheKey = `${persona}:${message.trim().toLowerCase()}`;
    if (chatCache.has(cacheKey)) {
      const cached = chatCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({ reply: cached.reply, cached: true });
      }
      chatCache.delete(cacheKey);
    }

    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.65 },
    });

    const result = await chat.sendMessage(promptWithPersona);
    const aiResponse = result.response.text();

    chatCache.set(cacheKey, { reply: aiResponse, timestamp: Date.now() });

    prisma.aiActivity
      .create({
        data: {
          type: "chat",
          userQuery: message.substring(0, 200),
          outputSummary: aiResponse.substring(0, 500),
          fullOutput: { reply: aiResponse, persona },
          metadata: { persona },
        },
      })
      .catch(() => {});

    return res.json({ reply: aiResponse });
  } catch (error) {
    console.error("❌ Gemini API Error in /api/chat:", error);
    return res.status(500).json({ error: "Something went wrong with Gemini API" });
  }
});

export default router;
