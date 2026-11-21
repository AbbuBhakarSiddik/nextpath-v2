import React from "react";
import { FiInfo, FiCompass, FiCpu, FiGithub } from "react-icons/fi";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">
          <FiInfo /> About NextPath.ai
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">Our Mission & Architecture</h1>
        <p className="mx-auto" style={{ color: "var(--text-muted)", maxWidth: "640px" }}>
          Empowering learners and developers worldwide with autonomous, open-source career intelligence.
        </p>
      </div>

      {/* Vision Panel */}
      <div className="glass-panel p-4 p-md-5 mb-4">
        <div className="d-flex align-items-center gap-3 mb-3">
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
            <FiCompass />
          </div>
          <h3 className="fw-bold text-white mb-0">Our Vision</h3>
        </div>
        <p style={{ color: "#e2e8f0", lineHeight: "1.8", fontSize: "1.05rem" }}>
          <strong>NextPath.ai</strong> is an open-source, full-stack intelligence platform 
          engineered to democratize career growth. Traditional career coaching and resume reviews 
          are often paywalled or slow. NextPath.ai harnesses high-velocity Gemini 2.5 generative AI 
          models, adaptive evaluation algorithms, and real-time tech feeds to offer immediate, 
          actionable career roadmaps at zero cost.
        </p>
      </div>

      {/* Objectives Panel */}
      <div className="glass-panel p-4 p-md-5 mb-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#38bdf8",
              fontSize: "1.2rem",
            }}
          >
            <FiCpu />
          </div>
          <h3 className="fw-bold text-white mb-0">Platform Pillars</h3>
        </div>

        <div className="row g-3 mt-2">
          {[
            {
              title: "Autonomous AI Mentorship",
              desc: "Streaming conversational guidance for interviews, salary discussions, course choices, and tech transitions.",
            },
            {
              title: "Adaptive Skill Arenas",
              desc: "Dynamic MCQ generation racing multiple Gemini models to evaluate reasoning and programming competencies.",
            },
            {
              title: "Strategic Role Roadmaps",
              desc: "Automated skill gap analysis highlighting exactly what to learn and build to qualify for target roles.",
            },
            {
              title: "Open Community Ecosystem",
              desc: "A public, searchable directory of builder portfolios, GitHub projects, and peer collaborators.",
            },
          ].map((pillar, idx) => (
            <div key={idx} className="col-md-6">
              <div
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "16px",
                  height: "100%",
                }}
              >
                <h5 className="fw-bold text-white mb-2" style={{ fontSize: "1rem" }}>
                  {pillar.title}
                </h5>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0, lineHeight: "1.5" }}>
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Source Call to Action */}
      <div className="text-center mt-5">
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="btn-neon">
            Explore All AI Tools &rarr;
          </Link>
          <a
            href="https://github.com/AbbuBhakarSiddik/nextpath-v2"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <FiGithub /> Join Us on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
