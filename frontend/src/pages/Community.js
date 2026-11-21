// frontend/src/pages/Community.js
import React, { useEffect, useState } from "react";
import { FiUsers, FiPlus, FiSearch, FiLayers } from "react-icons/fi";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CATEGORY_FILTERS = [
  { id: "all", label: "All Developers" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "cloud", label: "DevOps & Cloud" },
  { id: "systems", label: "Backend & Systems" },
];

const Community = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const res = await api.get("/community");
        setProfiles(res.data || []);
      } catch (err) {
        console.error("Failed to fetch community profiles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (profile.name && profile.name.toLowerCase().includes(term)) ||
      (profile.profession && profile.profession.toLowerCase().includes(term)) ||
      (profile.skills && profile.skills.some((skill) => skill.toLowerCase().includes(term)));

    if (!matchesSearch) return false;

    if (selectedCategory === "all") return true;

    const roleAndSkills = `${profile.profession || ""} ${(profile.skills || []).join(" ")}`.toLowerCase();

    if (selectedCategory === "fullstack") {
      return roleAndSkills.includes("full") || roleAndSkills.includes("react") || roleAndSkills.includes("web") || roleAndSkills.includes("node");
    }
    if (selectedCategory === "ai") {
      return roleAndSkills.includes("ai") || roleAndSkills.includes("ml") || roleAndSkills.includes("learning") || roleAndSkills.includes("python") || roleAndSkills.includes("torch");
    }
    if (selectedCategory === "cloud") {
      return roleAndSkills.includes("cloud") || roleAndSkills.includes("devops") || roleAndSkills.includes("k8s") || roleAndSkills.includes("kubernetes") || roleAndSkills.includes("aws");
    }
    if (selectedCategory === "systems") {
      return roleAndSkills.includes("system") || roleAndSkills.includes("backend") || roleAndSkills.includes("go") || roleAndSkills.includes("rust") || roleAndSkills.includes("sql");
    }

    return true;
  });

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="text-center mb-4 mb-md-5">
        <span className="badge-pill mb-2">
          <FiUsers /> Open-Source Peer Network
        </span>
        <h1 className="display-6 display-md-5 fw-bold text-white mb-2">Community Hub</h1>
        <p className="mx-auto px-2 mb-4" style={{ color: "var(--text-muted)", maxWidth: "620px", fontSize: "0.95rem" }}>
          Discover developers, showcase your open-source projects, and connect with peers across the globe.
        </p>
        <button
          className="btn-neon"
          onClick={() => navigate("/community/add")}
          style={{ fontSize: "0.95rem" }}
        >
          <FiPlus /> Add Your Developer Profile
        </button>
      </div>

      {/* Search & Category Filter Section */}
      <div className="mb-4 mb-md-5 mx-auto" style={{ maxWidth: "780px" }}>
        {/* Search Bar */}
        <div
          className="glass-panel d-flex align-items-center px-3 py-2 mb-3"
          style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.12)" }}
        >
          <FiSearch style={{ color: "#00FF7F", fontSize: "1.2rem", marginRight: "10px", flexShrink: 0 }} />
          <input
            type="text"
            className="form-control border-0 bg-transparent text-white shadow-none"
            placeholder="Search developers by name, role, or tech stack (e.g. React, Python, Cloud)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "0.95rem" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="btn-ghost"
              style={{ padding: "2px 8px", fontSize: "0.75rem", borderRadius: "6px" }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div
          className="d-flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="btn-ghost"
                style={{
                  fontSize: "0.8rem",
                  padding: "5px 14px",
                  borderRadius: "9999px",
                  backgroundColor: isSelected ? "rgba(0, 255, 127, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  borderColor: isSelected ? "#00FF7F" : "rgba(255, 255, 255, 0.1)",
                  color: isSelected ? "#00FF7F" : "#cbd5e1",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Cards Grid */}
      {loading ? (
        <div className="text-center py-5" style={{ color: "var(--text-muted)" }}>
          <div className="spinner-border text-success mb-3" role="status" />
          <p>Loading community profiles...</p>
        </div>
      ) : filteredProfiles.length > 0 ? (
        <div className="row g-4">
          {filteredProfiles.map((profile, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="glass-panel p-4 p-md-5 text-center mx-auto"
          style={{ maxWidth: "520px", borderRadius: "16px" }}
        >
          <FiLayers style={{ fontSize: "2rem", color: "#64748b", marginBottom: "12px" }} />
          <h5 className="text-white fw-bold mb-2">No Profiles Found</h5>
          <p style={{ color: "var(--text-muted)", marginBottom: "18px", fontSize: "0.9rem" }}>
            No developer profiles match your current search or category filter.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn-ghost"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
            >
              Reset Filters
            </button>
            <button
              className="btn-neon"
              onClick={() => navigate("/community/add")}
            >
              <FiPlus /> Be the First
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
