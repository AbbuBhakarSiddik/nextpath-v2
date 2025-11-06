import React from "react";
import { Link } from "react-router-dom";
import "../styles/custom.css"; // Import custom styles

function Intro() {
  return (
    <div className="bg-dark text-light d-flex flex-column min-vh-100">
      {/* Hero / Intro Section */}
      <section className="text-center py-5 bg-black shadow-sm">
        <h1 className="fw-bold display-4 bright-green">NextPath.ai 🚀</h1>
        <p className="lead text-white-50 mt-3">
          Your AI-powered career and learning companion.
        </p>
        {/* Attractive Register Button */}
        <Link to="/register">
          <button className="btn btn-bright-green btn-lg mt-4 px-5 fw-bold">
            Register Now
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container py-5 flex-grow-1">
        <h2 className="fw-bold text-center mb-5 text-white">
          Our Core Features
        </h2>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card bg-black text-light border-bright-green shadow h-100 p-3">
              <h5 className="fw-bold text-white">AI Career Advisor Chatbot</h5>
              <p className="text-white-50">
                Get instant career guidance and answers with our smart AI advisor.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-black text-light border-bright-green shadow h-100 p-3">
              <h5 className="fw-bold text-white">Smart Resume Analyzer</h5>
              <p className="text-white-50">
                Improve your resume with AI-powered feedback & keyword suggestions.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-black text-light border-bright-green shadow h-100 p-3">
              <h5 className="fw-bold text-white">AI-Powered IQ Test</h5>
              <p className="text-white-50">
                An adaptive intelligence assessment that uses AI to evaluate your
                 thinking abilities with personalized, real-time feedback.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-black text-light border-bright-green shadow h-100 p-3">
              <h5 className="fw-bold text-white">AI-Job Requirement Advisor</h5>
              <p className="text-white-50">
                An intelligent tool that analyzes your skills and career goals to suggest
                the best-matched job roles.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-black text-light border-bright-green shadow h-100 p-3">
              <h5 className="fw-bold text-white">Community Hub</h5>
              <p className="text-white-50">
                Connect, share, and grow with peers and mentors in our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-5">
        <div className="bg-black p-5 rounded shadow border border-bright-green">
          <h2 className="fw-bold text-white mb-3">About NextPath.ai</h2>
          <p className="lead text-white-50">
            NextPath.ai is designed to empower students and professionals by
            providing AI-driven tools that guide their career journey. From smart
            chatbots to resume analyzers, interview simulators, and career
            mapping, we help you take confident steps towards your goals while
            staying connected with a vibrant community.
          </p>
          <div className="text-center mt-4">
            <Link to="/register">
              <button className="btn btn-bright-green btn-lg px-5 fw-bold">
                Join NextPath.ai
              </button>
            </Link>
          </div>
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

export default Intro;
