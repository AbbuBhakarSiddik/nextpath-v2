// frontend/src/components/CommandPalette.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiExternalLink } from "react-icons/fi";
import { FEATURES } from "../config/features";

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Predefined actions & tools list
  const allItems = [
    ...FEATURES.map((f) => ({
      id: f.id,
      title: f.title,
      description: f.shortDesc,
      category: f.category,
      badge: f.badge,
      action: () => navigate(f.path),
    })),
    {
      id: "about",
      title: "About NextPath.ai",
      description: "Vision, mission, and the engineering team behind NextPath.ai",
      category: "Platform",
      badge: "Info",
      action: () => navigate("/about"),
    },
    {
      id: "features",
      title: "All Platform Features",
      description: "Detailed catalog of all intelligence modules and tool capabilities",
      category: "Platform",
      badge: "Docs",
      action: () => navigate("/features"),
    },
    {
      id: "contact",
      title: "Contact & Bug Report",
      description: "Submit feedback, report an issue, or contact the core team",
      category: "Support",
      badge: "Feedback",
      action: () => navigate("/contact"),
    },
    {
      id: "community-add",
      title: "Join Developer Directory",
      description: "Add your developer portfolio and tech stack to the Community Hub",
      category: "Community",
      badge: "Action",
      action: () => navigate("/community/add"),
    },
    {
      id: "github",
      title: "GitHub Repository",
      description: "View open-source source code, star the project, or contribute",
      category: "Open Source",
      badge: "External",
      action: () => window.open("https://github.com/AbbuBhakarSiddik/nextpath-v2", "_blank"),
    },
  ];

  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        filteredItems[selectedIndex].action();
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
      onClick={() => onClose(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          backgroundColor: "#0d1322",
          border: "1px solid rgba(0, 255, 127, 0.3)",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 127, 0.15)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            gap: "12px",
          }}
        >
          <FiSearch style={{ color: "#00FF7F", fontSize: "1.25rem", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search AI tools..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              borderRadius: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#94a3b8",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
            onClick={() => onClose(false)}
          >
            ESC
          </div>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "8px" }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "#64748b" }}>
              No commands or tools match "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "rgba(0, 255, 127, 0.12)" : "transparent",
                    border: isSelected ? "1px solid rgba(0, 255, 127, 0.3)" : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => {
                    item.action();
                    onClose(false);
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 600, color: isSelected ? "#00FF7F" : "#f8fafc", fontSize: "0.95rem" }}>
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(255, 255, 255, 0.06)",
                          color: "#94a3b8",
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {item.description}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {item.badge === "External" ? (
                      <FiExternalLink style={{ color: "#64748b", fontSize: "0.85rem" }} />
                    ) : (
                      <FiArrowRight style={{ color: isSelected ? "#00FF7F" : "#475569", fontSize: "0.95rem" }} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            backgroundColor: "#080c14",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            fontSize: "0.75rem",
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <span><strong style={{ color: "#94a3b8" }}>↑↓</strong> to navigate</span>
            <span><strong style={{ color: "#94a3b8" }}>Enter</strong> to select</span>
            <span><strong style={{ color: "#94a3b8" }}>Esc</strong> to close</span>
          </div>
          <span style={{ color: "#00FF7F" }}>NextPath.ai v2.0</span>
        </div>
      </div>
    </div>
  );
}
