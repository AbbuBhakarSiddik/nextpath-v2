import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// In-memory cache
let cache = {
  today: { data: null, timestamp: 0 },
  search: {}, // query: { data, timestamp }
};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Summarize text with Gemini Flash 2.5
const summarizeWithGemini = async (text) => {
  try {
    const response = await axios.post(
      "https://api.gemini.com/v1/flash-2.5/summarize",
      { text },
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.summary || text;
  } catch (err) {
    console.error();
    return text; // fallback
  }
};

// Fetch multiple pages from NewsAPI
const fetchNewsFromAPI = async (query = "technology", pages = 2, pageSize = 12) => {
  let allArticles = [];

  try {
    for (let page = 1; page <= pages; page++) {
      const res = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: query,
          language: "en",
          sortBy: "publishedAt",
          apiKey: NEWS_API_KEY,
          pageSize,
          page,
        },
      });

      const articles = res.data.articles.map((article) => ({
        title: article.title,
        description: article.description || article.content || "",
        source: article.source.name,
        url: article.url,
        publishedAt: article.publishedAt,
      }));

      allArticles = allArticles.concat(articles);
    }

    return allArticles;
  } catch (err) {
    console.error("NewsAPI fetch failed:", err.message);
    return [];
  }
};

// GET /today
export const getTodayNews = async (req, res) => {
  try {
    const now = Date.now();

    // Serve cached data if not expired
    if (cache.today.data && now - cache.today.timestamp < CACHE_DURATION) {
      return res.json(cache.today.data);
    }

    const articles = await fetchNewsFromAPI("technology", 2, 12);

    const summarized = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        description: await summarizeWithGemini(article.description),
      }))
    );

    // Update cache
    cache.today = { data: summarized, timestamp: now };

    res.json(summarized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch today's news" });
  }
};

// GET /search?query=
export const searchNews = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query parameter is required" });

    const now = Date.now();
    if (cache.search[query] && now - cache.search[query].timestamp < CACHE_DURATION) {
      return res.json(cache.search[query].data);
    }

    const articles = await fetchNewsFromAPI(query, 2, 12);

    const summarized = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        description: await summarizeWithGemini(article.description),
      }))
    );

    // Update cache
    cache.search[query] = { data: summarized, timestamp: now };

    res.json(summarized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to search news" });
  }
};

// POST /refresh
export const refreshNews = async (req, res) => {
  try {
    const articles = await fetchNewsFromAPI("technology", 2, 12);

    const summarized = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        description: await summarizeWithGemini(article.description),
      }))
    );

    // Update cache
    cache.today = { data: summarized, timestamp: Date.now() };

    res.json(summarized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to refresh news" });
  }
};
