// frontend/src/pages/ContactPage.js
import React, { useState } from "react";
import { FiMail, FiMessageSquare, FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import api from "../api";

const ContactPage = () => {
  const [bugData, setBugData] = useState({ email: "", bug: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const teamMembers = [
    {
      name: "Abbu bhakar siddik",
      role: "Lead Full Stack Engineer",
      email: "nextpathai@gmail.com",
      image: "/assets/about-me.jpg",
    },
    {
      name: "ThousifUlla",
      role: "AI & Systems Researcher",
      email: "nextpathai@gmail.com",
      image: "/assets/thosif.jpeg",
    },
    {
      name: "Yashwanth Patil",
      role: "UI / UX Designer",
      email: "nextpathai@gmail.com",
      image: "/assets/yashwanthpatil.jpeg",
    },
  ];

  const handleChange = (e) =>
    setBugData({ ...bugData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api.post("/bugreport", bugData);
      setStatus("success");
      setBugData({ email: "", bug: "" });
    } catch (error) {
      console.error("Bug report failed:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">
          <FiMail /> Team & Feedback
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">Meet the Team & Get in Touch</h1>
        <p className="mx-auto" style={{ color: "var(--text-muted)", maxWidth: "600px" }}>
          Have a feature idea, discovered a bug, or want to contribute to the open-source codebase? 
          We would love to hear from you.
        </p>
      </div>

      {/* Team Cards */}
      <div className="row g-4 mb-5">
        {teamMembers.map((member, index) => (
          <div className="col-md-4" key={index}>
            <div
              className="glass-panel p-4 text-center h-100 d-flex flex-column align-items-center"
              style={{ borderRadius: "16px" }}
            >
              <div
                className="mb-3 position-relative"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(0, 255, 127, 0.4)",
                  boxShadow: "0 0 20px rgba(0, 255, 127, 0.2)",
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <h5 className="fw-bold text-white mb-1">{member.name}</h5>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#38bdf8",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                {member.role}
              </span>
              <a
                href={`mailto:${member.email}`}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                {member.email}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback & Bug Reporting */}
      <div className="mx-auto" style={{ maxWidth: "720px" }}>
        <div className="glass-panel p-4 p-md-5" style={{ borderRadius: "18px" }}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(0, 255, 127, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00FF7F",
                fontSize: "1.2rem",
              }}
            >
              <FiMessageSquare />
            </div>
            <div>
              <h4 className="fw-bold text-white mb-0">Report a Bug or Suggest a Feature</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                Directly submitted to our issue tracker.
              </p>
            </div>
          </div>

          {status === "success" && (
            <div
              className="p-3 mb-4 rounded d-flex align-items-center gap-2"
              style={{
                backgroundColor: "rgba(0, 255, 127, 0.15)",
                border: "1px solid rgba(0, 255, 127, 0.4)",
                color: "#00FF7F",
              }}
            >
              <FiCheck /> Thank you! Your report has been submitted to the team.
            </div>
          )}

          {status === "error" && (
            <div
              className="p-3 mb-4 rounded d-flex align-items-center gap-2"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
              }}
            >
              <FiAlertCircle /> Something went wrong while submitting. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white fw-semibold small mb-1">
                Your Email <span style={{ color: "var(--accent-green)" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={bugData.email}
                onChange={handleChange}
                placeholder="developer@example.com"
                required
                className="form-control"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "10px 14px",
                }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-white fw-semibold small mb-1">
                Description / Feedback <span style={{ color: "var(--accent-green)" }}>*</span>
              </label>
              <textarea
                name="bug"
                rows={4}
                value={bugData.bug}
                onChange={handleChange}
                placeholder="Describe the bug, steps to reproduce, or feature request in detail..."
                required
                className="form-control"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "10px 14px",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-neon w-100 justify-content-center py-3"
              disabled={loading}
            >
              {loading ? "Submitting Report..." : (
                <>
                  <FiSend /> Submit Feedback & Bug Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
