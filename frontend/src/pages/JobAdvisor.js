import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api";

function JobAdvisor() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  // ✅ base URL for downloading file
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/jobadvisor", { role, skills });

      // backend sends { data, downloadUrl }
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
    <div className="container mt-5">
      <div className="card shadow-lg p-4 rounded">
        <h2 className="text-center text-primary mb-4">
          👔 AI Job Requirement Advisor
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Desired Job Role</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. AI Engineer, Data Scientist"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Your Current Skills</label>
            <textarea
              className="form-control"
              placeholder="e.g. Python, SQL, DBMS"
              rows="3"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {loading ? "Analyzing..." : "Get Roadmap"}
          </button>
        </form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-5">
          <h3 className="text-success">✅ Results</h3>

          <div className="row mt-3">
            <div className="col-md-6">
              <div className="card border-success mb-3">
                <div className="card-header bg-success text-white">
                  Skills You Have
                </div>
                <div className="card-body">
                  <ul>
                    {results.have?.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-danger mb-3">
                <div className="card-header bg-danger text-white">
                  Skills You Need
                </div>
                <div className="card-body">
                  <ul>
                    {results.need?.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="card border-info mb-3">
            <div className="card-header bg-info text-white">
              📘 Recommended Courses
            </div>
            <div className="card-body">
              <ul>
                {results.courses?.map((course, i) => (
                  <li key={i}>{course}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div className="card border-warning mb-3">
            <div className="card-header bg-warning">🛠 Project Ideas</div>
            <div className="card-body">
              <ul>
                {results.projects?.map((proj, i) => (
                  <li key={i}>{proj}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Download Button */}
          {downloadUrl && (
            <div className="text-center mt-4">
              <a
                href={`${BASE_URL}${downloadUrl}`}
                className="btn btn-success"
                download
              >
                📥 Download Report (.docx)
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobAdvisor;
