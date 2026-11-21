// frontend/src/pages/JobAdvisor.js
import React, { useState } from "react";
import {
  FiCompass,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
  FiCode,
  FiDownload,
  FiLayers,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import api from "../api";

const POPULAR_ROLES = [
  { role: "Full Stack AI Engineer", skills: "React, Node.js, Python, PostgreSQL, Git" },
  { role: "Cloud DevOps & Platform Architect", skills: "Linux, Docker, Bash, AWS basics" },
  { role: "Machine Learning & LLM Engineer", skills: "Python, PyTorch, Pandas, SQL" },
  { role: "Senior Backend / Systems Engineer", skills: "Go / Java, REST APIs, PostgreSQL" },
];

export default function JobAdvisor() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!role.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/jobadvisor", { role: role.trim(), skills: skills.trim() });
      if (res.data?.data) {
        setResults(res.data.data);
      } else {
        throw new Error("No analysis data returned from advisor");
      }
    } catch (err) {
      console.error("Error fetching job analysis:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to generate career roadmap. Please try again.";
      setError(msg);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const selectPresetRole = (preset) => {
    setRole(preset.role);
    setSkills(preset.skills);
  };

  const handleDownloadDocx = async () => {
    if (!results) return;
    setDownloading(true);
    try {
      const response = await api.post(
        "/jobadvisor/download",
        { role, skills, data: results },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `NextPath_${role.replace(/[^a-zA-Z0-9]/g, "_")}_Report.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download DOCX report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: "1050px" }}>
      {/* Header */}
      <div className="text-center mb-4 mb-md-5">
        <span className="badge-pill mb-2">
          <FiCompass /> Strategic Career Engine
        </span>
        <h1 className="display-6 display-md-5 fw-bold text-white mb-2">
          AI Job Requirement Advisor
        </h1>
        <p className="mx-auto px-2" style={{ color: "var(--text-muted)", maxWidth: "640px", fontSize: "0.95rem" }}>
          Input your target job role and current skillset to generate an instant skill-gap roadmap,
          recommended certifications, and high-impact portfolio project ideas.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="glass-panel p-3 p-md-5 mb-5">
        {/* Preset Chips */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700 }}>
            <FiZap style={{ color: "#00FF7F" }} /> QUICK PRESETS (CLICK TO AUTOFILL)
          </div>
          <div className="d-flex flex-wrap gap-2">
            {POPULAR_ROLES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-ghost"
                style={{
                  fontSize: "0.8rem",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  backgroundColor: role === preset.role ? "rgba(0, 255, 127, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  borderColor: role === preset.role ? "#00FF7F" : "rgba(255, 255, 255, 0.1)",
                  color: role === preset.role ? "#00FF7F" : "#cbd5e1",
                }}
                onClick={() => selectPresetRole(preset)}
              >
                {preset.role}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 mb-md-4">
            <label className="form-label text-white fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
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
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-white fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
              Your Current Skills (Comma Separated)
            </label>
            <textarea
              className="form-control"
              placeholder="e.g. JavaScript, React, Node.js, Git, SQL basics, Docker"
              rows="3"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 14px",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-neon w-100 justify-content-center py-3"
            disabled={loading}
            style={{ fontSize: "1rem" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Analyzing Career Path with Gemini AI...
              </>
            ) : (
              <>
                Generate Strategic Roadmap <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            className="mt-4 p-3 rounded"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-4 mt-md-5">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
            <div>
              <span className="badge-pill mb-1">Generated Analysis</span>
              <h2 className="fw-bold text-white mb-0" style={{ fontSize: "1.5rem" }}>
                Career Roadmap for <span style={{ color: "var(--accent-green)" }}>{role}</span>
              </h2>
            </div>
            <button
              onClick={handleDownloadDocx}
              disabled={downloading}
              className="btn-ghost d-inline-flex align-items-center gap-2"
              style={{ padding: "8px 18px", fontSize: "0.9rem", width: "auto" }}
            >
              <FiDownload /> {downloading ? "Preparing DOCX..." : "Download Report (.docx)"}
            </button>
          </div>

          {/* Visual Roadmap Stages Progress */}
          <div className="glass-panel p-4 mb-4">
            <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
              <FiLayers style={{ color: "#00FF7F" }} /> Strategic 4-Phase Progression
            </h5>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <div
                  className="p-3 h-100 rounded"
                  style={{
                    backgroundColor: "rgba(0, 255, 127, 0.05)",
                    border: "1px solid rgba(0, 255, 127, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#00FF7F" }}>STAGE 1</span>
                  <div className="fw-bold text-white my-1" style={{ fontSize: "0.95rem" }}>
                    Core Fundamentals
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Consolidate existing skills and master foundational paradigms.
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div
                  className="p-3 h-100 rounded"
                  style={{
                    backgroundColor: "rgba(56, 189, 248, 0.05)",
                    border: "1px solid rgba(56, 189, 248, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8" }}>STAGE 2</span>
                  <div className="fw-bold text-white my-1" style={{ fontSize: "0.95rem" }}>
                    Skill Gap Acquisition
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Bridge missing tools: {(results.need || []).slice(0, 2).join(", ") || "Advanced concepts"}.
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div
                  className="p-3 h-100 rounded"
                  style={{
                    backgroundColor: "rgba(168, 85, 247, 0.05)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a855f7" }}>STAGE 3</span>
                  <div className="fw-bold text-white my-1" style={{ fontSize: "0.95rem" }}>
                    Proof-of-Work Projects
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Deploy and open-source real-world projects showing end-to-end mastery.
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div
                  className="p-3 h-100 rounded"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.05)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b" }}>STAGE 4</span>
                  <div className="fw-bold text-white my-1" style={{ fontSize: "0.95rem" }}>
                    Interview & Delivery
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    System design interviews, tech assessments, and production readiness.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Skills You Have */}
            <div className="col-12 col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(0, 255, 127, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiCheckCircle style={{ color: "#00FF7F", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0" style={{ fontSize: "1.1rem" }}>
                    Skills You Already Have
                  </h5>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {results.have && results.have.length > 0 ? (
                    results.have.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.85rem",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(0, 255, 127, 0.1)",
                          color: "#00FF7F",
                          border: "1px solid rgba(0, 255, 127, 0.2)",
                        }}
                      >
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Foundational knowledge detected. Ready for core skill building!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Skills You Need */}
            <div className="col-12 col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(239, 68, 68, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiAlertCircle style={{ color: "#f87171", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0" style={{ fontSize: "1.1rem" }}>
                    Priority Skills To Acquire
                  </h5>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {results.need && results.need.length > 0 ? (
                    results.need.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "0.85rem",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          color: "#fca5a5",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        + {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      All key skills matched! Focus on portfolio delivery.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="col-12 col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(56, 189, 248, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiBookOpen style={{ color: "#38bdf8", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0" style={{ fontSize: "1.1rem" }}>
                    Recommended Certifications & Courses
                  </h5>
                </div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                  {results.courses && results.courses.length > 0 ? (
                    results.courses.map((c, i) => (
                      <li
                        key={i}
                        className="d-flex align-items-start gap-2"
                        style={{ color: "#cbd5e1", fontSize: "0.9rem" }}
                      >
                        <span style={{ color: "#38bdf8", flexShrink: 0 }}>📖</span>
                        <span>{c}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Self-guided official documentation recommended.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* High-Impact Project Ideas */}
            <div className="col-12 col-md-6">
              <div
                className="glass-panel h-100 p-4"
                style={{ border: "1px solid rgba(168, 85, 247, 0.3)" }}
              >
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FiCode style={{ color: "#a855f7", fontSize: "1.3rem" }} />
                  <h5 className="fw-bold text-white mb-0" style={{ fontSize: "1.1rem" }}>
                    Portfolio Project Ideas
                  </h5>
                </div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                  {results.projects && results.projects.length > 0 ? (
                    results.projects.map((p, i) => (
                      <li
                        key={i}
                        className="d-flex align-items-start gap-2"
                        style={{ color: "#cbd5e1", fontSize: "0.9rem" }}
                      >
                        <span style={{ color: "#a855f7", flexShrink: 0 }}>🚀</span>
                        <span>{p}</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      Contribute to existing open-source codebases.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
