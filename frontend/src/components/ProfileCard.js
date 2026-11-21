// frontend/src/components/ProfileCard.js
import React from "react";
import { FiMail, FiExternalLink, FiFolder, FiBookOpen } from "react-icons/fi";

const ProfileCard = ({ profile }) => {
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "NP";

  return (
    <div
      className="glass-panel h-100 p-4 d-flex flex-column"
      style={{
        borderRadius: "16px",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}
    >
      {/* Header with Monogram */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(0, 255, 127, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)",
            border: "1px solid rgba(0, 255, 127, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#00FF7F",
            fontWeight: 800,
            fontSize: "1.1rem",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h5
            className="fw-bold text-white mb-1"
            style={{
              fontSize: "1.05rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {profile.name}
          </h5>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "2px 8px",
              borderRadius: "6px",
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              fontWeight: 600,
              display: "inline-block",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {profile.profession}
          </span>
        </div>
      </div>

      {/* Education */}
      {profile.education && (
        <div
          className="d-flex align-items-center gap-2 mb-3"
          style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
        >
          <FiBookOpen style={{ color: "#64748b", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {profile.education}
          </span>
        </div>
      )}

      {/* Skills Badges */}
      <div className="mb-3 flex-grow-1">
        <div
          style={{
            fontSize: "0.72rem",
            textTransform: "uppercase",
            color: "#64748b",
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginBottom: "8px",
          }}
        >
          Tech Stack
        </div>
        <div className="d-flex flex-wrap gap-1">
          {profile.skills?.map((skill, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.75rem",
                padding: "3px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#e2e8f0",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mb-3">
          <div
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              color: "#64748b",
              fontWeight: 700,
              letterSpacing: "0.05em",
              marginBottom: "6px",
            }}
          >
            Featured Projects
          </div>
          <div className="d-flex flex-column gap-1">
            {profile.projects.map((p, idx) => (
              <a
                key={idx}
                href={p}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#38bdf8",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <FiFolder style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{p}</span>
                <FiExternalLink style={{ flexShrink: 0, fontSize: "0.75rem" }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Looking For & Connect */}
      <div
        className="mt-auto pt-3 d-flex flex-column gap-2"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
      >
        {profile.lookingFor && (
          <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            <strong style={{ color: "#00FF7F" }}>Looking for:</strong> {profile.lookingFor}
          </div>
        )}
        {profile.contactEmail && (
          <a
            href={`mailto:${profile.contactEmail}`}
            className="btn-ghost justify-content-center py-2 mt-1"
            style={{
              fontSize: "0.8rem",
              borderRadius: "8px",
              color: "#00FF7F",
              borderColor: "rgba(0, 255, 127, 0.25)",
              backgroundColor: "rgba(0, 255, 127, 0.05)",
            }}
          >
            <FiMail /> Connect via Email
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
