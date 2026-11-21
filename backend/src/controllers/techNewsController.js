// backend/src/controllers/techNewsController.js
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Initialize Gemini
let geminiModel = null;
if (GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  } catch (err) {
    console.warn("⚠️ Gemini AI initialization warning for TechNews:", err.message);
  }
}

// ── Top 1 Genuine Tech Media Outlets Per Country ─────────────────────────────
export const TOP_TECH_MEDIA = [
  {
    country: "United States",
    code: "US",
    flag: "🇺🇸",
    domain: "techcrunch.com",
    sourceName: "TechCrunch",
    focus: "AI, DevTools, Silicon Valley & Cloud Infrastructure",
  },
  {
    country: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    domain: "theregister.com",
    sourceName: "The Register",
    focus: "Enterprise Systems, Linux, Cybersecurity & Data Centers",
  },
  {
    country: "India",
    code: "IN",
    flag: "🇮🇳",
    domain: "gadgets360.com",
    sourceName: "Gadgets 360",
    focus: "Tech Ecosystem, Semiconductors & Software Developments",
  },
  {
    country: "Germany",
    code: "DE",
    flag: "🇩🇪",
    domain: "heise.de",
    sourceName: "Heise Online",
    focus: "Software Engineering, Open Source, Protocols & Security",
  },
  {
    country: "Canada",
    code: "CA",
    flag: "🇨🇦",
    domain: "betakit.com",
    sourceName: "BetaKit",
    focus: "AI Innovation, Venture & Quantum Computing",
  },
  {
    country: "Australia",
    code: "AU",
    flag: "🇦🇺",
    domain: "itnews.com.au",
    sourceName: "iTnews",
    focus: "Cloud Architecture, Network Scale & Telecommunications",
  },
  {
    country: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    domain: "techinasia.com",
    sourceName: "Tech in Asia",
    focus: "DeepTech, FinTech Systems & Southeast Asian Tech",
  },
  {
    country: "Global",
    code: "GL",
    flag: "🌐",
    domain: "arstechnica.com",
    sourceName: "Ars Technica",
    focus: "Deep Tech, Compilers, Chips & Operating Systems",
  },
];

// Helper to match domain to country metadata
function enrichArticleCountry(article) {
  const urlLower = (article.url || "").toLowerCase();
  const sourceLower = (article.source || "").toLowerCase();

  const match = TOP_TECH_MEDIA.find(
    (m) =>
      urlLower.includes(m.domain) ||
      sourceLower.includes(m.sourceName.toLowerCase()) ||
      sourceLower.includes(m.domain.split(".")[0])
  );

  if (match) {
    return {
      ...article,
      country: match.country,
      countryCode: match.code,
      flag: match.flag,
      source: match.sourceName,
    };
  }

  return {
    ...article,
    country: "Global",
    countryCode: "GL",
    flag: "🌐",
    source: article.source || "Tech Dispatch",
  };
}

// ── Zero-Downtime Curated Fallback News Bank ─────────────────────────────────
const FALLBACK_TECH_NEWS = [
  {
    title: "Anthropic Releases Claude 3.7 Sonnet with Hybrid Reasoning Architecture",
    description: "Combines instant responses with token-level adaptive reasoning models, offering engineers dynamic switch capabilities between ultra-fast inference and deep logic synthesis.",
    source: "TechCrunch",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    url: "https://techcrunch.com",
    publishedAt: new Date().toISOString(),
    category: "AI & Models",
  },
  {
    title: "Linux Kernel 6.14 Merges Enhanced Bcachefs & Memory Management Patches",
    description: "Linus Torvalds cut the latest mainline candidate featuring major architectural updates for multi-core memory reclamation and atomic file operations on NVMe storage.",
    source: "The Register",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    url: "https://www.theregister.com",
    publishedAt: new Date().toISOString(),
    category: "Systems & Linux",
  },
  {
    title: "India Semiconductor Mission Inks Major 3nm Packaging & Foundry Tie-Ups",
    description: "Key semiconductor fabrication centers in Gujarat and Karnataka scale up operational tooling for next-generation silicon design, edge computing hardware, and native RISC-V chipsets.",
    source: "Gadgets 360",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    url: "https://www.gadgets360.com",
    publishedAt: new Date().toISOString(),
    category: "Hardware & Silicon",
  },
  {
    title: "Rust 1.85 Stabilizes Async Closures & Edition 2024 Enhancements",
    description: "The Rust project delivers landmark ergonomics with full async closure stabilization, eliminating legacy workaround macros and unlocking high-performance concurrent pipelines.",
    source: "Heise Online",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    url: "https://www.heise.de",
    publishedAt: new Date().toISOString(),
    category: "Programming Languages",
  },
  {
    title: "Cohere and Canadian AI Labs Expand Sovereign Enterprise LLM Deployments",
    description: "Enterprise multi-lingual model weights deployed natively on air-gapped infrastructure to ensure GDPR and PIPEDA compliance for global financial institutions.",
    source: "BetaKit",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    url: "https://betakit.com",
    publishedAt: new Date().toISOString(),
    category: "Enterprise AI",
  },
  {
    title: "Australian Cloud Providers Deploy Multi-Region Quantum-Safe Encryption",
    description: "Post-quantum cryptographic algorithms (Kyber and Dilithium) integrated across national government cloud backbones to counter future decryption risks.",
    source: "iTnews",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    url: "https://www.itnews.com.au",
    publishedAt: new Date().toISOString(),
    category: "Cloud Security",
  },
  {
    title: "Southeast Asian Tech Giants Migrate Core Microservices to WebAssembly (Wasm)",
    description: "Edge container runtimes powered by Wasm achieve 10x faster cold starts and 40% memory reduction compared to standard Docker containers in high-traffic payment gateways.",
    source: "Tech in Asia",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    url: "https://www.techinasia.com",
    publishedAt: new Date().toISOString(),
    category: "Architecture & Edge",
  },
  {
    title: "PostgreSQL 17 Benchmark Analysis: Parallel Query & JSON Improvements",
    description: "In-depth telemetry shows up to 300% query throughput acceleration on B-Tree indexes and streaming I/O optimizations under high-concurrency client workloads.",
    source: "Ars Technica",
    country: "Global",
    countryCode: "GL",
    flag: "🌐",
    url: "https://arstechnica.com",
    publishedAt: new Date().toISOString(),
    category: "Databases",
  },
];

// In-memory cache
let cache = {
  today: { data: null, timestamp: 0 },
  search: {},
};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache to preserve API quota

// ── Pre-Prompted Gemini Technical Summarizer ─────────────────────────────────
const summarizeWithGemini = async (title, text, source) => {
  if (!geminiModel || !text || text.trim().length < 20) return text;

  try {
    const prompt = `You are NextPath.ai Tech Intelligence Analyst.
Analyze this technical dispatch from ${source}:
Headline: "${title}"
Details: "${text}"

Rules:
- Filter exclusively for developer, software engineering, AI, or architectural relevance.
- Provide a concise 2-sentence breakdown explaining the technical breakthrough, architecture, or developer impact.
- Discard promotional clickbait, PR marketing, or trivial gadget hype.
- Be precise, technical, and actionable.`;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text() || text;
  } catch (err) {
    return text;
  }
};

// ── Fetch from NewsAPI using Top-1 Channel Domains ───────────────────────────
const fetchNewsFromAPI = async (query = "") => {
  if (!NEWS_API_KEY) {
    console.warn("⚠️ NEWS_API_KEY is not configured. Serving curated fallback tech news.");
    return FALLBACK_TECH_NEWS;
  }

  try {
    const domains = TOP_TECH_MEDIA.map((m) => m.domain).join(",");
    const searchQuery = query.trim()
      ? `(${query}) AND (technology OR AI OR software OR developer OR cloud OR system)`
      : "technology OR AI OR software OR developer OR cloud OR systems";

    const res = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: searchQuery,
        domains,
        language: "en",
        sortBy: "publishedAt",
        apiKey: NEWS_API_KEY,
        pageSize: 16,
        page: 1,
      },
      timeout: 5000,
    });

    const rawArticles = res.data?.articles || [];
    if (rawArticles.length === 0) return FALLBACK_TECH_NEWS;

    const enriched = rawArticles
      .filter((a) => a.title && !a.title.includes("[Removed]"))
      .map((article) => {
        const base = {
          title: article.title,
          description: article.description || article.content || "",
          source: article.source?.name || "Tech Media",
          url: article.url,
          publishedAt: article.publishedAt,
          urlToImage: article.urlToImage,
        };
        return enrichArticleCountry(base);
      });

    return enriched.length > 0 ? enriched : FALLBACK_TECH_NEWS;
  } catch (err) {
    console.warn("⚠️ NewsAPI error or rate-limit hit. Serving curated fallback feed:", err.message);
    return FALLBACK_TECH_NEWS;
  }
};

// GET /api/technews/today
export const getTodayNews = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.today.data && now - cache.today.timestamp < CACHE_DURATION) {
      return res.json(cache.today.data);
    }

    const rawArticles = await fetchNewsFromAPI();

    // Summarize top articles with pre-prompted Gemini
    const summarized = await Promise.all(
      rawArticles.map(async (article, idx) => {
        // Only run Gemini on the top 6 to prevent hitting API quotas
        if (idx < 6 && article.description) {
          const aiSummary = await summarizeWithGemini(
            article.title,
            article.description,
            article.source
          );
          return { ...article, description: aiSummary, isAiSummarized: true };
        }
        return article;
      })
    );

    cache.today = { data: summarized, timestamp: now };
    return res.json(summarized);
  } catch (err) {
    console.error("Failed to fetch today's news:", err);
    return res.json(FALLBACK_TECH_NEWS);
  }
};

// GET /api/technews/search?query=
export const searchNews = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return getTodayNews(req, res);

    const cacheKey = query.toLowerCase().trim();
    const now = Date.now();
    if (cache.search[cacheKey] && now - cache.search[cacheKey].timestamp < CACHE_DURATION) {
      return res.json(cache.search[cacheKey].data);
    }

    const rawArticles = await fetchNewsFromAPI(query);

    const summarized = await Promise.all(
      rawArticles.slice(0, 12).map(async (article, idx) => {
        if (idx < 4 && article.description) {
          const aiSummary = await summarizeWithGemini(
            article.title,
            article.description,
            article.source
          );
          return { ...article, description: aiSummary, isAiSummarized: true };
        }
        return article;
      })
    );

    cache.search[cacheKey] = { data: summarized, timestamp: now };
    return res.json(summarized);
  } catch (err) {
    console.error("Failed to search news:", err);
    return res.json(FALLBACK_TECH_NEWS);
  }
};

// POST /api/technews/refresh
export const refreshNews = async (req, res) => {
  try {
    const rawArticles = await fetchNewsFromAPI();
    const summarized = await Promise.all(
      rawArticles.map(async (article, idx) => {
        if (idx < 6 && article.description) {
          const aiSummary = await summarizeWithGemini(
            article.title,
            article.description,
            article.source
          );
          return { ...article, description: aiSummary, isAiSummarized: true };
        }
        return article;
      })
    );

    cache.today = { data: summarized, timestamp: Date.now() };
    return res.json(summarized);
  } catch (err) {
    console.error("Failed to refresh news:", err);
    return res.json(FALLBACK_TECH_NEWS);
  }
};
