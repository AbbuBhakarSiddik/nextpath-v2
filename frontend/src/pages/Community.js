// frontend/src/pages/Community.js
import React, { useEffect, useState } from "react";
import { FiUsers, FiPlus, FiSearch } from "react-icons/fi";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Community = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
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
    const term = search.toLowerCase();
    return (
      (profile.name && profile.name.toLowerCase().includes(term)) ||
      (profile.profession && profile.profession.toLowerCase().includes(term)) ||
      (profile.skills && profile.skills.some((skill) => skill.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge-pill mb-2">
          <FiUsers /> Open-Source Peer Network
        </span>
        <h1 className="display-5 fw-bold text-white mb-3">Community Hub</h1>
        <p className="mx-auto mb-4" style={{ color: "var(--text-muted)", maxWidth: "600px" }}>
          Discover developers, showcase your portfolio projects, and connect with peers across the globe.
        </p>
        <button
          className="btn-neon"
          onClick={() => navigate("/community/add")}
        >
          <FiPlus /> Add Your Developer Profile
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-5 mx-auto" style={{ maxWidth: "560px" }}>
        <div
          className="glass-panel d-flex align-items-center px-3 py-2"
          style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <FiSearch style={{ color: "#00FF7F", fontSize: "1.1rem", marginRight: "10px" }} />
          <input
            type="text"
            className="form-control border-0 bg-transparent text-white shadow-none"
            placeholder="Search developers by name, role, or tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "0.95rem" }}
          />
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
            <div key={idx} className="col-md-6 col-lg-4">
              <ProfileCard profile={profile} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="glass-panel p-5 text-center mx-auto"
          style={{ maxWidth: "500px", borderRadius: "16px" }}
        >
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
            No developer profiles match "{search}"
          </p>
          <button
            className="btn-ghost"
            onClick={() => setSearch("")}
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default Community;
