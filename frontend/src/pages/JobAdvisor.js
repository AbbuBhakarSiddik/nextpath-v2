import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function JobAdvisor() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/jobadvisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, skills }),
      });

      const data = await response.json();
      setResults(data.data); // backend sends { data, downloadUrl }
      setDownloadUrl(data.downloadUrl);
    } catch (err) {
      console.error("Error fetching results:", err);
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
                href={`http://localhost:5000${downloadUrl}`}
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
