// backend/src/config/gemini.js
// NextPath.ai — Resilient Gemini Model Selector & Fallback Architecture
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
export const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Official latest model hierarchy (verified live with user API key)
export const LATEST_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-pro-latest",
].filter(Boolean);

/**
 * Returns a generative model instance with the preferred latest model.
 */
export function getGeminiModel(options = {}) {
  if (!genAI) return null;
  const modelName = options.model || process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

  const config = { model: modelName };
  if (options.systemInstruction) {
    config.systemInstruction = options.systemInstruction;
  }

  return genAI.getGenerativeModel(config);
}

/**
 * Execute generation with automatic fallback across latest models if high-demand 503 or 404 occurs.
 */
export async function generateContentWithFallback(prompt, options = {}) {
  if (!genAI) throw new Error("GEMINI_API_KEY is not configured");

  const modelsToTry = [
    options.preferredModel || process.env.GEMINI_MODEL,
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
  ].filter(Boolean);

  let lastError = null;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: options.generationConfig || {},
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        return { text, model: modelName };
      }
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Model ${modelName} failed (${err.message.split("\n")[0]}). Trying next candidate...`);
    }
  }

  throw lastError || new Error("All Gemini models failed to generate content");
}
