import React, { useState } from "react";
import Results from "../components/Results";
import "../styles/ResumeAnalyzer.css";
import api from "../api";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!file) return setError("⚠️ Please upload a resume first!");

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // ✅ Use api.js (axios)
      const res = await api.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(res.data);
    } catch (err) {
      console.error("Error analyzing resume:", err);

      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to analyze resume";

      setError(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-container">
      <h1 className="resume-title">📄 Resume Analyzer</h1>
      <h2 className="resume-subtitle">Upload .doc, or .docx files only</h2>

      <div className="upload-box">
        <input
          type="file"
          accept=".doc,.docx"
          onChange={handleFileChange}
        />
        <p>
          {file
            ? `✅ Uploaded: ${file.name}`
            : "Drag & drop or click to upload resume"}
        </p>

        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="loading">🔍 Analyzing your resume...</div>}
      {results && <Results results={results} />}
    </div>
  );
}
