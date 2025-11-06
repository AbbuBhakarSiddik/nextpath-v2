import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const About = () => {
  return (
    <Container fluid className="bg-dark text-light py-5 min-vh-100">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1
          style={{
            color: "#00FF7F",
            fontWeight: "bold",
            fontSize: "2.8rem",
            textShadow: "0 0 20px rgba(0, 255, 127, 0.5)",
          }}
        >
          About NextPath AI
        </h1>
        <p
          className="fst-italic"
          style={{ fontSize: "1.2rem", color: "#b5b5b5" }}
        >
          “Empowering the future with AI-driven career intelligence and innovation.”
        </p>
      </div>

      {/* Project Overview */}
      <Row className="justify-content-center px-4">
        <Col md={10} lg={8}>
          <Card
            className="shadow-lg border-0 p-4 mb-5"
            style={{
              backgroundColor: "#121212",
              borderRadius: "20px",
              border: "2px solid rgba(0, 255, 127, 0.5)",
              boxShadow: "0 0 25px rgba(0, 255, 127, 0.15)",
            }}
          >
            <Card.Body>
              <h3
                style={{
                  color: "#00FF7F",
                  fontWeight: "bold",
                  textShadow: "0 0 10px rgba(0,255,127,0.3)",
                }}
                className="mb-3 text-center"
              >
                Our Vision
              </h3>
              <p style={{ textAlign: "justify", lineHeight: "1.7",color: "#f8f4f4ff" }}>
                <strong>NextPath AI</strong> is a web + AI integrated platform
                designed to bridge the gap between developers, learners, and job seekers
                by combining advanced AI capabilities with intuitive web design.
                Our goal is to empower individuals through intelligent career tools,
                community-driven collaboration, and real-time insights from the tech world.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Objective Section */}
      <Row className="justify-content-center px-4">
        <Col md={10} lg={8}>
          <Card
            className="shadow-lg border-0 p-4 mb-5"
            style={{
              backgroundColor: "#121212",
              borderRadius: "20px",
              border: "2px solid rgba(0, 255, 127, 0.5)",
              boxShadow: "0 0 25px rgba(0, 255, 127, 0.15)",
            }}
          >
            <Card.Body>
              <h3
                style={{
                  color: "#00FF7F",
                  fontWeight: "bold",
                  textShadow: "0 0 10px rgba(0,255,127,0.3)",
                }}
                className="mb-3 text-center"
              >
                Project Objectives
              </h3>
              <ul style={{ lineHeight: "1.8", fontSize: "1.05rem" ,color: "#f8f4f4ff"}}>
                <li>
                  Develop a smart career assistant that leverages AI to guide
                  users through personalized job and learning paths.
                </li>
                <li>
                  Integrate AI tools like Gemini Flash 2.5 for resume analysis,
                  intelligent recommendations, and conversation-based guidance.
                </li>
                <li>
                  Build a community-driven ecosystem where developers can share
                  projects, showcase skills, and collaborate.
                </li>
                <li>
                  Provide real-time AI-curated tech news to keep users updated
                  on global innovations and trends.
                </li>
                <li>
                  Combine the power of <strong>React + Node.js + MongoDB</strong>
                  with AI integration for smooth, intelligent, and scalable web experiences.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Web + AI Integration */}
      <Row className="justify-content-center px-4">
        <Col md={10} lg={8}>
          <Card
            className="shadow-lg border-0 p-4"
            style={{
              backgroundColor: "#121212",
              borderRadius: "20px",
              border: "2px solid rgba(0, 255, 127, 0.5)",
              boxShadow: "0 0 25px rgba(0, 255, 127, 0.15)",
            }}
          >
            <Card.Body>
              <h3
                style={{
                  color: "#00FF7F",
                  fontWeight: "bold",
                  textShadow: "0 0 10px rgba(0,255,127,0.3)",
                }}
                className="mb-3 text-center"
              >
                Web + AI Power
              </h3>
              <p style={{ textAlign: "justify", lineHeight: "1.7" , color: "#f8f4f4ff"}}>
                The foundation of <strong>NextPath AI</strong> lies in the seamless fusion of
                modern web technologies and generative AI. React ensures a fast and
                dynamic user experience, Node.js and Express handle robust backend logic,
                while MongoDB enables efficient data management. On top of this, Gemini AI
                powers intelligent resume insights, job recommendations, and personalized
                user interactions — creating a system that learns, adapts, and evolves
                with every user.
              </p>
              <p
                className="text-center mt-4 fst-italic"
                style={{ color: "#b5b5b5" }}
              >
                “NextPath AI — where technology meets intelligence to shape tomorrow’s careers.”
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
