// frontend/src/components/Navbar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCommand, FiMenu, FiX, FiGithub, FiZap } from "react-icons/fi";
import { getEnabledFeatures } from "../config/features";

export default function Navbar({ onOpenCommandPalette }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const features = getEnabledFeatures();

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "rgba(8, 12, 20, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                NextPath<span style={{ color: "#00FF7F" }}>.ai</span>
              </span>

            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="d-none d-lg-flex"
          style={{
            alignItems: "center",
            gap: "6px",
          }}
        >
          {features.map((feature) => {
            const active = isActive(feature.path);
            return (
              <Link
                key={feature.id}
                to={feature.path}
                style={{
                  color: active ? "#00FF7F" : "#94a3b8",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: active ? 700 : 500,
                  padding: "8px 14px",
                  borderRadius: "8px",
                  backgroundColor: active ? "rgba(0, 255, 127, 0.08)" : "transparent",
                  border: active ? "1px solid rgba(0, 255, 127, 0.25)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {feature.title.replace("AI ", "")}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Search Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Command Palette Button */}


          {/* GitHub Repo */}
          <a
            href="https://github.com/AbbuBhakarSiddik/nextpath-v2"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f8fafc",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            title="Open-Source on GitHub"
          >
            <FiGithub style={{ fontSize: "1.1rem" }} />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="d-lg-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: mobileMenuOpen ? "rgba(0, 255, 127, 0.15)" : "transparent",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: mobileMenuOpen ? "#00FF7F" : "#fff",
              cursor: "pointer",
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FiX style={{ fontSize: "1.3rem" }} /> : <FiMenu style={{ fontSize: "1.3rem" }} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none"
          style={{
            backgroundColor: "rgba(10, 15, 26, 0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(0, 255, 127, 0.3)",
            padding: "16px 20px 24px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700, paddingLeft: "6px" }}>
              AI Intelligence Engines
            </span>
            {features.map((feature) => (
              <Link
                key={feature.id}
                to={feature.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: "44px",
                  color: isActive(feature.path) ? "#00FF7F" : "#e2e8f0",
                  textDecoration: "none",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: isActive(feature.path) ? "rgba(0, 255, 127, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  border: isActive(feature.path) ? "1px solid rgba(0, 255, 127, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                <span>{feature.title}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    color: feature.badgeColor || "#00FF7F",
                  }}
                >
                  {feature.badge}
                </span>
              </Link>
            ))}

            <hr style={{ borderColor: "rgba(255, 255, 255, 0.08)", margin: "14px 0" }} />

            <div style={{ display: "flex", gap: "16px", paddingLeft: "6px" }}>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                Community
              </Link>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                Features
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem", minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
