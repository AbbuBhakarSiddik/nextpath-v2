import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiGithub, FiZap, FiCode, FiCompass, FiAward } from "react-icons/fi";
import { getEnabledFeatures } from "../config/features";
import "../styles/custom.css";

function Home() {
  const features = getEnabledFeatures();

  return (
    <div className="flex-grow-1" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Hero Section */}
      <section className="py-5 text-center position-relative overflow-hidden">
        <div className="container py-4">


          <h1 className="display-4 fw-extrabold text-white mb-3" style={{ fontWeight: 800 }}>
            Supercharge Your Career with <br className="d-none d-md-block" />
            <span className="text-gradient">Autonomous AI Intelligence</span>
          </h1>

          <p className="lead mx-auto mb-4" style={{ color: "var(--text-muted)", maxWidth: "720px", fontSize: "1.15rem" }}>
            Explore AI-powered career roadmaps, gamified technical skill benchmarking, real-time developer news,
            and open-source peer networking zero sign-up barriers, 100% open access.
          </p>


          {/* Quick Stats Banner */}
          <div
            className="row g-3 justify-content-center mx-auto"
            style={{ maxWidth: "800px" }}
          >
            {[
              { icon: <FiCompass />, label: "Autonomous Engines", val: "5 Tools" },
              { icon: <FiZap />, label: "Sign-Up Barriers", val: "Easy" },
              { icon: <FiAward />, label: "Powered By", val: "Gemini Latest" },
              { icon: <FiCode />, label: "Licensing", val: "100% MIT" },
            ].map((stat, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div
                  className="glass-panel p-3 text-center"
                  style={{ borderRadius: "12px" }}
                >
                  <div style={{ color: "var(--accent-green)", fontSize: "1.2rem", marginBottom: "4px" }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: "1.1rem" }}>{stat.val}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="badge-pill mb-2">Core Capabilities</span>
          <h2 className="fw-bold text-white mb-2">Explore the AI Intelligence Suite</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Select any engine below to begin your personalized career acceleration
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {features.map((feature) => (
            <div key={feature.id} className="col-md-6 col-lg-4">
              <Link to={feature.path} className="text-decoration-none">
                <div
                  className="glass-panel h-100 p-4 d-flex flex-column position-relative overflow-hidden"
                  style={{
                    borderRadius: "16px",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {/* Category Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: feature.badgeColor || "#00FF7F",
                      }}
                    >
                      {feature.category}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: feature.badgeColor || "#00FF7F",
                        border: `1px solid ${feature.badgeColor || "#00FF7F"}33`,
                      }}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  {/* Feature Visual */}
                  <div
                    className="mb-3 d-flex align-items-center justify-content-center p-3 rounded"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.3)", borderRadius: "12px" }}
                  >
                    <img
                      src={feature.img}
                      alt={feature.title}
                      style={{ height: "140px", objectFit: "contain", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}
                    />
                  </div>

                  {/* Content */}
                  <h4 className="fw-bold text-white mb-2" style={{ fontSize: "1.2rem" }}>
                    {feature.title}
                  </h4>
                  <p className="small flex-grow-1" style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                    {feature.shortDesc}
                  </p>

                  <div
                    className="mt-3 pt-3 d-flex align-items-center justify-content-between"
                    style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-green)" }}>
                      Launch Tool
                    </span>
                    <FiArrowRight style={{ color: "var(--accent-green)", fontSize: "1.1rem" }} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Open Source Callout */}
      <section className="container py-5 mb-4">
        <div
          className="glass-panel p-5 text-center position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 12, 20, 0.95) 100%)",
            border: "1px solid rgba(0, 255, 127, 0.25)",
            borderRadius: "20px",
          }}
        >
          <h3 className="fw-bold text-white mb-3">100% Free & Open Source for Everyone</h3>
          <p className="mx-auto mb-4" style={{ color: "var(--text-muted)", maxWidth: "600px" }}>
            NextPath.ai is built in public by a passionate community of engineers. We welcome contributors,
            suggestions, and feedback from developers around the globe.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <a
              href="https://github.com/AbbuBhakarSiddik/nextpath-v2"
              target="_blank"
              rel="noreferrer"
              className="btn-neon"
            >
              <FiGithub /> Contribute on GitHub
            </a>
            <Link to="/contact" className="btn-ghost">
              Feedback & Bug Reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
