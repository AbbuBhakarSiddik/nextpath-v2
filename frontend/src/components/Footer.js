// frontend/src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiZap, FiHeart } from "react-icons/fi";
import { getEnabledFeatures } from "../config/features";

export default function Footer() {
  const features = getEnabledFeatures();

  return (
    <footer
      style={{
        backgroundColor: "#060910",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "60px 0 30px",
        marginTop: "auto",
        color: "#94a3b8",
        fontSize: "0.9rem",
      }}
    >
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #00FF7F 0%, #008f4c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiZap style={{ color: "#060910", fontSize: "1rem" }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>
                NextPath<span style={{ color: "#00FF7F" }}>.ai</span>
              </span>
            </Link>

            <p style={{ lineHeight: "1.6", color: "#64748b", maxWidth: "340px" }}>
              An open-source AI career intelligence suite empowering developers, students, and professionals with 
              autonomous mentorship, skill benchmarking, and roadmaps.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <a
                href="https://github.com/AbbuBhakarSiddik/nextpath-v2"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#f8fafc",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                <FiGithub /> Star on GitHub
              </a>
            </div>
          </div>

          {/* AI Tools */}
          <div className="col-lg-3 col-md-6">
            <h6 style={{ color: "#ffffff", fontWeight: 700, marginBottom: "18px", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              AI Intelligence
            </h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {features.map((f) => (
                <li key={f.id}>
                  <Link
                    to={f.path}
                    style={{
                      color: "#94a3b8",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00FF7F")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                  >
                    {f.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div className="col-lg-2 col-md-6">
            <h6 style={{ color: "#ffffff", fontWeight: 700, marginBottom: "18px", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              Platform
            </h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link to="/features" style={{ color: "#94a3b8", textDecoration: "none" }}>
                  Features Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>
                  About Project
                </Link>
              </li>
              <li>
                <Link to="/community/add" style={{ color: "#94a3b8", textDecoration: "none" }}>
                  Join Community
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: "#94a3b8", textDecoration: "none" }}>
                  Report a Bug
                </Link>
              </li>
            </ul>
          </div>

          {/* System Status & Architecture */}
          <div className="col-lg-3 col-md-6">
            <h6 style={{ color: "#ffffff", fontWeight: 700, marginBottom: "18px", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
              System Status
            </h6>
            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#00FF7F",
                    boxShadow: "0 0 10px #00FF7F",
                  }}
                />
                <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>
                  AI Core Operational
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                Powered by Google Gemini 2.5 Flash + PostgreSQL. Zero login barriers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "#64748b",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} NextPath.ai. Open Source under MIT License.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            Built with <FiHeart style={{ color: "#ef4444" }} /> by the NextPath.ai Community
          </div>
        </div>
      </div>
    </footer>
  );
}
