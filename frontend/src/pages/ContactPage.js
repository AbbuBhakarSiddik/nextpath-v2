import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import "../styles/ContactPage.css";
import api from "../api";

const ContactPage = () => {
  const [bugData, setBugData] = useState({ email: "", bug: "" });
  const [status, setStatus] = useState("");

  const teamMembers = [
    {
      name: "Abbu bhakar siddik",
      profession: "Java-Full stack Developer",
      email: "nextpathai@gmail.com",
      image: "/assets/about-me.jpg",
    },
    {
      name: "ThousifUlla",
      profession: "Developer/Researcher",
      email: "nextpathai@gmail.com",
      image: "/assets/thosif.jpeg",
    },
    {
      name: "Arbaz Pasha",
      profession: "presentation",
      email: "nextpathai@gmail.com",
      image: "/assets/arbaz.jpeg",
    },
    {
      name: "Pruthvi H D",
      profession: "Reserve designer",
      email: "nextpathai@gmail.com",
      image: "/assets/pruthvi.jpeg",
    },
  ];

  const handleChange = (e) =>
    setBugData({ ...bugData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bugreport", bugData);
      setStatus("success");
      setBugData({ email: "", bug: "" });
    } catch (error) {
      console.error("Bug report failed:", error);
      setStatus("error");
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="contact-header">Contact NextPath AI Team</h1>
          <p className="text-muted">Meet the developers behind this project</p>
        </Col>
      </Row>

      {/* Team Section */}
      <Row className="mb-5">
        {teamMembers.map((member, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <Card className="team-card text-center shadow-sm h-100">
              <div className="team-img-wrapper">
                <Card.Img
                  variant="top"
                  src={member.image}
                  className="team-img"
                />
              </div>
              <Card.Body>
                <Card.Title>{member.name}</Card.Title>
                <Card.Subtitle className="mb-2">
                  {member.profession}
                </Card.Subtitle>
                <Card.Text>{member.email}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bug Report Section */}
      <Row className="mb-3">
        <Col md={8} className="mx-auto">
          <Card className="bug-card p-4 shadow-sm">
            <h4 className="mb-3">Report a Bug</h4>

            {status === "success" && (
              <Alert variant="success">
                Bug has been reported successfully!
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="danger">Something went wrong. Try again.</Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={bugData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Describe the Bug</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="bug"
                  value={bugData.bug}
                  onChange={handleChange}
                  placeholder="Explain the issue you found..."
                  required
                />
              </Form.Group>

              <Button type="submit" className="bug-btn">
                Report Bug
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
