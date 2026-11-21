import React, { useState } from "react";
import { FiCompass, FiCheckCircle, FiTarget, FiBookOpen, FiCode, FiDownload } from "react-icons/fi";
import api from "../api";

export default function JobAdvisor() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/jobadvisor", { role, skills });
      setResults(res.data?.data || null);
      setDownloadUrl(res.data?.downloadUrl || null);
    } catch (err) {
      console.error("Error fetching results:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "❌ Failed to fetch job roadmap. Try again.";
      setError(msg);
      setResults(null);
      setDownloadUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">
          <FiCompass /> Strategic Career Engine
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">AI Job Requirement Advisor</h1>
        <p className="mx-auto" style={{ color: "var(--text-muted)", maxWidth: "640px" }}>
          Input your target job role and current skillset to generate an instant skill-gap roadmap, 
          recommended certifications, and high-impact portfolio project ideas.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="glass-panel p-4 p-md-5 mb-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-white fw-semibold mb-2">
              Desired Job Role <span style={{ color: "var(--accent-green)" }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Full Stack AI Engineer, Cloud Architect, Data Scientist"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 16px",
              }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-white fw-semibold mb-2">
              Your Current Skills (Comma Separated)
            </label>
            <textarea
              className="form-control"
              placeholder="e.g. JavaScript, React, Node.js, Git, SQL, Docker basics"
              rows="3"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 16px",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-neon w-100 justify-content-center py-3"
            disabled={loading}
          >
            {loading ? "Analyzing Career Path with Gemini AI..." : "Generate Strategic Roadmap →"}
          </button>
        </form>

        {error && (
          <div
            className="mt-4 p-3 rounded"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div>
              <span className="badge-pill mb-1">Generated Analysis</span>
              <h2 className="fw-bold text-white mb-0">Career Gap Roadmap for {role}</h2>
            </div>
            {downloadUrl && (
              <a
                href={`${BASE_URL}${downloadUrl}`}
                className="btn-ghost"
                download
              >
                <FiDownload /> Download DOCX Report
              </a>
            )}
          </div>

          <div className="row g-4">
            {/* Skills You Have */}
            <div className="col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(0, 255, 127, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiCheckCircle style={{ color: "#00FF7F", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0">Skills You Already Have</h5>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {results.have && results.have.length > 0 ? (
                    results.have.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: "rgba(0, 255, 127, 0.1)",
                          color: "#00FF7F",
                          border: "1px solid rgba(0, 255, 127, 0.3)",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem" }}>No matching skills specified.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills You Need */}
            <div className="col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(56, 189, 248, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiTarget style={{ color: "#38bdf8", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0">Skills You Need to Acquire</h5>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {results.need?.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: "rgba(56, 189, 248, 0.1)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(168, 85, 247, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiBookOpen style={{ color: "#a855f7", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0">Recommended Courses & Certs</h5>
                </div>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {results.courses?.map((c, i) => (
                    <li
                      key={i}
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: "#a855f7" }}>&bull;</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Project Ideas */}
            <div className="col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(245, 158, 11, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiCode style={{ color: "#f59e0b", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0">High-Impact Project Ideas</h5>
                </div>
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {results.projects?.map((p, i) => (
                    <li
                      key={i}
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: "#f59e0b" }}>&bull;</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
