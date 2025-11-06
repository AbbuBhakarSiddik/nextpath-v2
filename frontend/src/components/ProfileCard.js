// frontend/src/components/ProfileCard.js
import React from "react";
import { Card, Badge } from "react-bootstrap";

const ProfileCard = ({ profile }) => {
  return (
    <Card
      className="h-100 shadow-sm"
      style={{
        backgroundColor: "white",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
      }}
    >
      <Card.Body>
        <Card.Title style={{ color: "#000000ff" }}>{profile.name}</Card.Title>
        <Badge bg="info" className="mb-2">{profile.profession}</Badge>
        <Card.Text><strong>Education:</strong> {profile.education}</Card.Text>
        <Card.Text>
          <strong>Skills:</strong>{" "}
          {profile.skills.map((skill) => (
            <Badge bg="secondary" key={skill} className="me-1">
              {skill}
            </Badge>
          ))}
        </Card.Text>
        <Card.Text>
          <strong>Projects:</strong>
          <ul>
            {profile.projects.map((p, idx) => (
              <li key={idx}>
                <a href={p} target="_blank" rel="noreferrer">{p}</a>
              </li>
            ))}
          </ul>
        </Card.Text>
        <Card.Text><strong>Email:</strong> {profile.contactEmail}</Card.Text>
        {profile.lookingFor && (
          <Card.Text><strong>Looking For:</strong> {profile.lookingFor}</Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
