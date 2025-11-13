import React, { useState } from "react";
import Results from "../components/Results";
import "../styles/ResumeAnalyzer.css";

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

      const res = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to analyze resume");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-container">
      <h1 className="resume-title">📄 Resume Analyzer</h1>
      <h2 className="resume-subtitle">Upload .pdf, .doc, or .docx files only</h2>

      <div className="upload-box">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
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
