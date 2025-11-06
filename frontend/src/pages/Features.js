import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Features = () => {
  const featureList = [
    {
      title: "Resume Analyzer",
      description:
        "Empower your career journey with AI-driven resume insights. Upload your resume and let NextPath AI evaluate your strengths, identify improvement areas, and match your skillset to the most relevant job roles. Designed for precision and growth, it’s like having a professional career coach in your pocket.",
    },
    {
      title: "AI Career Advisor",
      description:
        "Harness the power of Gemini AI to explore your best career path. Based on your goals, education, and skills, NextPath AI provides intelligent suggestions, growth roadmaps, and learning resources to help you make informed career decisions and achieve long-term success.",
    },
    {
      title: "IQ Tester",
      description:
        "Challenge your intellect with an adaptive AI-powered IQ test. From pattern recognition to logical reasoning, each question evolves with your performance to ensure accurate intelligence measurement — fun, fast, and deeply insightful.",
    },
    {
      title: "Tech News",
      description:
        "Stay ahead in the tech world! Get real-time AI-curated news covering breakthroughs in AI, software development, blockchain, and cloud technologies. With keyword search and instant updates, you’ll never miss what’s trending in innovation.",
    },
    {
      title: "Community Hub",
      description:
        "Connect with developers around the world. The Community Hub lets you showcase your skills, education, and projects — collaborate with like-minded techies, find opportunities, and grow your professional network. Powered by the spirit of creation and collaboration.",
    },
  ];

  return (
    <Container fluid className="bg-dark text-light py-5 min-vh-100">
      <div className="text-center mb-5">
        <h1
          style={{
            color: "#00FF7F",
            fontWeight: "bold",
            fontSize: "2.8rem",
            textShadow: "0 0 20px rgba(0, 255, 127, 0.5)",
          }}
        >
          NextPath AI Features
        </h1>
        <p
          className="fst-italic"
          style={{ fontSize: "1.2rem", color: "#b5b5b5" }}
        >
          “Discover how each feature empowers innovation, intelligence, and growth.”
        </p>
      </div>

      <Row className="justify-content-center px-3">
        {featureList.map((feature, idx) => (
          <Col key={idx} md={6} lg={5} xl={4} className="mb-5">
            <Card
              className="shadow-lg border-0"
              style={{
                backgroundColor: "#fff",
                color: "black",
                borderRadius: "25px",
                border: "2px solid rgba(0, 255, 127, 0.6)",
                boxShadow: "0 0 25px rgba(0, 255, 127, 0.15)",
                transition:
                  "transform 0.4s ease, box-shadow 0.4s ease, border 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.border = "2px solid #00FF7F";
                e.currentTarget.style.boxShadow =
                  "0 0 35px rgba(0, 255, 127, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.border =
                  "2px solid rgba(0, 255, 127, 0.6)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0, 255, 127, 0.15)";
              }}
            >
              <Card.Body className="p-4">
                <Card.Title
                  className="mb-3 text-center"
                  style={{
                    color: "#007F3F",
                    fontWeight: "bold",
                    fontSize: "1.6rem",
                    textShadow: "0 0 10px rgba(0, 127, 63, 0.3)",
                  }}
                >
                  {feature.title}
                </Card.Title>
                <Card.Text
                  style={{
                    fontSize: "1.05rem",
                    lineHeight: "1.6",
                    textAlign: "justify",
                  }}
                >
                  {feature.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>

  );
};

export default Features;
