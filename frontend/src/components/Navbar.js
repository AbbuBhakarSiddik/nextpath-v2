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
        backgroundColor: "rgba(8, 12, 20, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
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
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00FF7F 0%, #008f4c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(0, 255, 127, 0.4)",
            }}
          >
            <FiZap style={{ color: "#080c14", fontSize: "1.2rem", strokeWidth: 3 }} />
          </div>
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
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(0, 255, 127, 0.15)",
                  color: "#00FF7F",
                  border: "1px solid rgba(0, 255, 127, 0.3)",
                }}
              >
                v2.0
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
          <button
            onClick={() => onOpenCommandPalette(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#94a3b8",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Open Command Palette (Ctrl + K)"
          >
            <FiCommand style={{ color: "#00FF7F" }} />
            <span className="d-none d-md-inline" style={{ fontSize: "0.8rem" }}>Search</span>
            <kbd
              style={{
                fontSize: "0.65rem",
                padding: "2px 5px",
                borderRadius: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#cbd5e1",
              }}
            >
              Ctrl K
            </kbd>
          </button>

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
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none"
          style={{
            backgroundColor: "#0d1322",
            borderBottom: "1px solid rgba(0, 255, 127, 0.3)",
            padding: "16px 20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
              AI Tools
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
                  color: isActive(feature.path) ? "#00FF7F" : "#e2e8f0",
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: isActive(feature.path) ? "rgba(0, 255, 127, 0.1)" : "transparent",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                <span>{feature.title}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: feature.badgeColor || "#00FF7F",
                  }}
                >
                  {feature.badge}
                </span>
              </Link>
            ))}

            <hr style={{ borderColor: "rgba(255, 255, 255, 0.08)", margin: "12px 0" }} />

            <div style={{ display: "flex", gap: "16px" }}>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}
              >
                Features
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}
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
