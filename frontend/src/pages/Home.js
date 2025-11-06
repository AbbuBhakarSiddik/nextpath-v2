import React from "react";
import { Link } from "react-router-dom";

import "../styles/custom.css";

function Home() {
  const features = [
    {
      title: "AI Career Advisor Chatbot",
      desc: "Get instant career guidance and answers with our smart AI advisor.",
      img: "/assets/chatbot.jpg",
      link: "/chat",
    },
    {
      title: "Smart Resume Analyzer",
      desc: "Improve your resume with AI-powered feedback & keyword suggestions.",
      img: "/assets/resume.jpg",
      link: "/resume",
    },
    {
      title: "AI-Powered IQ Test",
      desc: "An adaptive intelligence assessment that uses AI to evaluate your thinking abilities with personalized, real-time feedback.",
      img: "/assets/interview.jpg",
      link: "/interview",
    },
    {
      title: "AI-Job Requirement Advisor",
      desc: "An intelligent tool that analyzes your skills and career goals to suggest the best-matched job roles.",
      img: "/assets/path.jpg",
      link: "/career-path",
    },
    {
      title: "Daily Tech News",
      desc: "Stay updated with the latest technology trends, AI advancements and developer tools every day.",
      img: "/assets/technews.jpg",
      link: "/news",
    },
    {
      title: "Community Hub",
      desc: "Connect, share, and grow with peers and mentors in our community.",
      img: "/assets/feed.jpg",
      link: "/community",
    },
  ];

  return (
    <div className="bg-dark text-light d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-black py-3 shadow-sm border-bottom border-bright-green">
        <div className="container d-flex justify-content-between align-items-center">
          <h2 className="fw-bold text-white">Welcome to NextPath.ai 🚀</h2>
        </div>
      </header>

      {/* Features Cards */}
      <section className="container py-5 flex-grow-1">
        <h2 className="fw-bold text-center mb-5 text-white">Explore Our Features</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <Link
                to={feature.link || "#"}
                className="text-decoration-none"
              >
                <div className="card bg-black text-light border-bright-green shadow h-100 feature-card">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="card-img-top p-3"
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-white">{feature.title}</h5>
                    <p className="card-text text-white-50">{feature.desc}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-light text-center py-4 mt-auto border-top border-bright-green">
        <div className="container">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} NextPath.ai. All rights reserved.
          </p>
          <div className="d-flex justify-content-center mb-2">
            <Link to="/features" className="bright-green mx-2 text-decoration-none">Features</Link>
            <Link to="/about" className="bright-green mx-2 text-decoration-none">About</Link>
            <Link to="/contact" className="bright-green mx-2 text-decoration-none">Contact</Link>
          </div>
          <p className="small text-white-50">
            Built with ❤️ by the NextPath.ai Team
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
