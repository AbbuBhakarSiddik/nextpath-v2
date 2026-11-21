// frontend/src/pages/Features.js
import React from "react";
import { Link } from "react-router-dom";
import { FiLayers, FiArrowRight } from "react-icons/fi";
import { getEnabledFeatures } from "../config/features";

const Features = () => {
  const featureList = getEnabledFeatures();

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">
          <FiLayers /> Complete Feature Catalog
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">AI Engine Capabilities</h1>
        <p className="mx-auto" style={{ color: "var(--text-muted)", maxWidth: "640px" }}>
          Discover the complete suite of open-source autonomous tools driving NextPath.ai v2.0.
        </p>
      </div>

      {/* Feature List */}
      <div className="row g-4 justify-content-center">
        {featureList.map((feature) => (
          <div key={feature.id} className="col-md-6 col-lg-4">
            <div
              className="glass-panel h-100 p-4 d-flex flex-column"
              style={{
                borderRadius: "18px",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Category & Badge */}
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
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    color: feature.badgeColor || "#00FF7F",
                    border: `1px solid ${feature.badgeColor || "#00FF7F"}33`,
                  }}
                >
                  {feature.badge}
                </span>
              </div>

              {/* Title & Tagline */}
              <h4 className="fw-bold text-white mb-1" style={{ fontSize: "1.2rem" }}>
                {feature.title}
              </h4>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#38bdf8",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                {feature.tagline}
              </p>

              {/* Description */}
              <p
                className="flex-grow-1"
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                }}
              >
                {feature.fullDesc || feature.shortDesc}
              </p>

              {/* Action Button */}
              {feature.path && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <Link
                    to={feature.path}
                    className="btn-neon w-100 justify-content-center py-2"
                  >
                    Open Tool <FiArrowRight />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
