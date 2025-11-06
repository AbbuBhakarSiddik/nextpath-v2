// frontend/src/pages/AddProfile.js
import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
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
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/community", {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
        projects: formData.projects.split(",").map((p) => p.trim()),
      });
      setSuccess("Profile added successfully!");
      setFormData({
        name: "",
        profession: "",
        education: "",
        skills: "",
        projects: "",
        contactEmail: "",
        lookingFor: "",
      });
      setTimeout(() => navigate("/community"), 1500); // redirect to Community
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container fluid className="bg-dark min-vh-100 d-flex justify-content-center align-items-start p-5">
      <Card
        className="p-5 shadow-lg"
        style={{ maxWidth: "700px", width: "100%", backgroundColor: "white" }}
      >
        <div className="text-center mb-4">
          <h2 style={{ color: "#00a030ff" }}>Add Your Profile</h2>
          <p className="text-muted fst-italic mb-1"> <h3 style={{ fontSize: "0.9rem",color: "#000000ff" }}>
            "Join the Community Hub — powered by NextPath AI"
            </h3>
          </p>
          <p className="text-muted fst-italic"><h4 style={{ fontSize: "0.9rem",color: "#000000ff" }}>
            Share your skills and connect with like-minded developers
            </h4>
          </p>
        </div>

        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          {[
            { label: "Name", name: "name", type: "text", required: true },
            { label: "Profession", name: "profession", type: "text", required: true },
            { label: "Education", name: "education", type: "text" },
            { label: "Skills (comma separated)", name: "skills", type: "text" },
            { label: "Projects (comma separated links)", name: "projects", type: "text" },
            { label: "Contact Email", name: "contactEmail", type: "email", required: true },
            { label: "Looking For (Optional)", name: "lookingFor", type: "text" },
          ].map((field) => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required || false}
              />
            </Form.Group>
          ))}
          <Button type="submit" className="w-100 mt-3" variant="success">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AddProfile;
