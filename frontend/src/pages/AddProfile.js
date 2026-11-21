// frontend/src/pages/AddProfile.js
import React, { useState } from "react";
import { FiUserPlus, FiArrowLeft, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AddProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    education: "",
    skills: "",
    projects: "",
    contactEmail: "",
    lookingFor: "",
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/community", {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
        projects: formData.projects ? formData.projects.split(",").map((p) => p.trim()) : [],
      });
      setSuccess("Profile added successfully! Redirecting to Community Hub...");
      setFormData({
        name: "",
        profession: "",
        education: "",
        skills: "",
        projects: "",
        contactEmail: "",
        lookingFor: "",
      });
      setTimeout(() => navigate("/community"), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text", placeholder: "e.g. Alex Chen", required: true },
    { label: "Current Profession / Role", name: "profession", type: "text", placeholder: "e.g. Full Stack Developer, AI Researcher", required: true },
    { label: "Education / Institution", name: "education", type: "text", placeholder: "e.g. B.Tech Computer Science, Stanford / Self-Taught" },
    { label: "Skills (Comma separated)", name: "skills", type: "text", placeholder: "e.g. TypeScript, React, Python, Docker, PyTorch" },
    { label: "Featured Projects (Comma separated links)", name: "projects", type: "text", placeholder: "e.g. https://github.com/user/project1, https://myportfolio.dev" },
    { label: "Contact Email", name: "contactEmail", type: "email", placeholder: "e.g. alex@example.com", required: true },
    { label: "Looking For (Optional)", name: "lookingFor", type: "text", placeholder: "e.g. Open Source Collaborators, Mentorship, Full-time Roles" },
  ];

  return (
    <div className="container py-5" style={{ maxWidth: "760px" }}>
      <button
        onClick={() => navigate("/community")}
        className="btn-ghost mb-4"
        style={{ padding: "6px 14px", fontSize: "0.85rem" }}
      >
        <FiArrowLeft /> Back to Community
      </button>

      <div className="glass-panel p-4 p-md-5">
        <div className="text-center mb-4">
          <span className="badge-pill mb-2">
            <FiUserPlus /> Open-Source Builder Directory
          </span>
          <h2 className="fw-bold text-white mb-2">Add Your Developer Profile</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Share your technical skills, active repositories, and collaborate with the global NextPath.ai community.
          </p>
        </div>

        {success && (
          <div
            className="p-3 mb-4 rounded d-flex align-items-center gap-2"
            style={{
              backgroundColor: "rgba(0, 255, 127, 0.15)",
              border: "1px solid rgba(0, 255, 127, 0.4)",
              color: "#00FF7F",
            }}
          >
            <FiCheck /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="mb-3" key={field.name}>
              <label className="form-label text-white fw-semibold small mb-1">
                {field.label} {field.required && <span style={{ color: "var(--accent-green)" }}>*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required || false}
                className="form-control"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "0.95rem",
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn-neon w-100 justify-content-center py-3 mt-4"
            disabled={loading}
          >
            {loading ? "Publishing Profile..." : "Publish Profile to Community Hub →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;
