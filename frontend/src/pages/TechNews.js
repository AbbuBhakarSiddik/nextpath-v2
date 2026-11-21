// frontend/src/pages/TechNews.js
import React, { useState, useEffect } from "react";
import {
  FiRadio,
  FiSearch,
  FiRefreshCw,
  FiExternalLink,
  FiClock,
  FiGlobe,
  FiCpu,
} from "react-icons/fi";
import api from "../api";

const COUNTRIES = [
  { code: "ALL", label: "All Channels", flag: "🌐" },
  { code: "US", label: "USA", flag: "🇺🇸", channel: "TechCrunch" },
  { code: "GB", label: "UK", flag: "🇬🇧", channel: "The Register" },
  { code: "IN", label: "India", flag: "🇮🇳", channel: "Gadgets 360" },
  { code: "DE", label: "Germany", flag: "🇩🇪", channel: "Heise Online" },
  { code: "CA", label: "Canada", flag: "🇨🇦", channel: "BetaKit" },
  { code: "AU", label: "Australia", flag: "🇦🇺", channel: "iTnews" },
  { code: "SG", label: "Singapore", flag: "🇸🇬", channel: "Tech in Asia" },
  { code: "GL", label: "Global", flag: "🌐", channel: "Ars Technica" },
];

const TechNews = () => {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodayNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/technews/today");
      setNews(res.data || []);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Failed to fetch daily tech pulse ❌");
    } finally {
      setLoading(false);
    }
  };

  const searchNews = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return fetchTodayNews();

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/technews/search?query=${encodeURIComponent(query)}`);
      setNews(res.data || []);
    } catch (err) {
      console.error("Failed to search news:", err);
      setError("Failed to search news ❌");
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/technews/refresh");
      setNews(res.data || []);
    } catch (err) {
      console.error("Failed to refresh news:", err);
      setError("Failed to refresh news ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayNews();
  }, []);

  const filteredNews = news.filter((article) => {
    if (selectedCountry === "ALL") return true;
    return article.countryCode === selectedCountry;
  });

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">
          <FiRadio /> Top Global Tech Channels (1 per country)
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">Daily Tech Pulse</h1>
        <p className="mx-auto mb-4" style={{ color: "var(--text-muted)", maxWidth: "660px" }}>
          Curated technical dispatches from genuine top tech media across the globe, pre-prompted and analyzed by Gemini Flash AI for engineering impact.
        </p>
      </div>

      {/* Country Filter Pills */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {COUNTRIES.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCountry(c.code)}
            className={`btn-ghost d-inline-flex align-items-center gap-1 ${
              selectedCountry === c.code ? "active-filter-pill" : ""
            }`}
            style={{
              padding: "6px 14px",
              fontSize: "0.85rem",
              borderRadius: "20px",
              border:
                selectedCountry === c.code
                  ? "1px solid #00FF7F"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor:
                selectedCountry === c.code
                  ? "rgba(0, 255, 127, 0.12)"
                  : "rgba(255, 255, 255, 0.03)",
              color: selectedCountry === c.code ? "#00FF7F" : "#94a3b8",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span>{c.flag}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        <form onSubmit={searchNews} className="d-flex gap-2" style={{ maxWidth: "520px", width: "100%" }}>
          <div
            className="glass-panel d-flex align-items-center px-3 flex-grow-1"
            style={{ borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <FiSearch style={{ color: "#00FF7F", fontSize: "1.1rem", marginRight: "10px" }} />
            <input
              type="text"
              placeholder="Search AI, Cloud, Rust, LLMs, DevOps..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control border-0 bg-transparent text-white shadow-none"
              style={{ fontSize: "0.95rem" }}
            />
          </div>
          <button type="submit" className="btn-neon" disabled={loading}>
            Search
          </button>
        </form>

        <button
          onClick={refreshNews}
          className="btn-ghost"
          disabled={loading}
          title="Force refresh live feed"
        >
          <FiRefreshCw className={loading ? "spin" : ""} /> Refresh Feed
        </button>
      </div>

      {error && (
        <div
          className="p-3 mb-4 rounded text-center mx-auto"
          style={{
            maxWidth: "600px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5" style={{ color: "var(--text-muted)" }}>
          <div className="spinner-border text-success mb-3" role="status" />
          <p>Curating latest tech intelligence from global channels with Gemini AI...</p>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="row g-4">
          {filteredNews.map((article, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div
                className="glass-panel h-100 p-4 d-flex flex-column"
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Source & Date Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-1">
                    <span style={{ fontSize: "1.1rem" }}>{article.flag || "🌐"}</span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(168, 85, 247, 0.12)",
                        color: "#c084fc",
                        border: "1px solid rgba(168, 85, 247, 0.25)",
                      }}
                    >
                      {article.source}
                    </span>
                  </div>
                  {article.publishedAt && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-subtle)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FiClock /> {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Article Title */}
                <h5 className="fw-bold text-white mb-3" style={{ fontSize: "1.02rem", lineHeight: "1.4" }}>
                  {article.title}
                </h5>

                {/* AI Summary Description */}
                <p
                  className="flex-grow-1"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.88rem",
                    lineHeight: "1.6",
                  }}
                >
                  {article.description}
                </p>

                {/* Footer Link */}
                <div
                  className="mt-3 pt-3 d-flex align-items-center justify-content-between"
                  style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FiCpu style={{ color: "#38bdf8" }} /> Gemini Technical Insight
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "var(--accent-green)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Read Source <FiExternalLink />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-5 text-center mx-auto" style={{ maxWidth: "500px", borderRadius: "16px" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
            No articles match the current filter.
          </p>
          <button className="btn-ghost" onClick={() => setSelectedCountry("ALL")}>
            <FiGlobe /> Show All Channels
          </button>
        </div>
      )}
    </div>
  );
};

export default TechNews;
