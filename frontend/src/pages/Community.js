// frontend/src/pages/Community.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ProfileCard from "../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Community = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]); // no dummy data
  const [search, setSearch] = useState("");

  // Fetch profiles from backend API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/community");
        setProfiles(res.data); // store backend data
      } catch (err) {
        console.error("Failed to fetch community profiles:", err);
      }
    };
    fetchProfiles();
  }, []);

  // Filter profiles by search
  const filteredProfiles = profiles.filter((profile) => {
    const term = search.toLowerCase();
    return (
      profile.name.toLowerCase().includes(term) ||
      profile.profession.toLowerCase().includes(term) ||
      profile.skills.some((skill) => skill.toLowerCase().includes(term))
    );
  });

  return (
    <Container fluid className="bg-dark min-vh-100 p-4 text-light">
      {/* Centered header */}
      <div className="text-center mb-5">
        <h2 className="mb-2" style={{ color: "#00FF7F", fontSize: "2.5rem" }}>
          Community Hub
        </h2>
        <p className="text-light fst-italic mb-4" style={{ fontSize: "1.2rem" }}>
          "Connect. Collaborate. Create."
        </p>
        <Button
          variant="success"
          onClick={() => navigate("/community/add")}
        >
          Add Your Profile
        </Button>
      </div>

      {/* Search bar */}
      <Form className="d-flex justify-content-center mb-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Form.Control
          type="text"
          placeholder="Search by name, profession, or skills"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary" className="ms-2">
          Search
        </Button>
      </Form>

      {/* Profile cards */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, idx) => (
            <Col key={idx}>
              <ProfileCard profile={profile} />
            </Col>
          ))
        ) : (
          <p className="text-center text-light">No profiles found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Community;
