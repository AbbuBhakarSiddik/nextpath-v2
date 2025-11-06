import { Routes, Route } from "react-router-dom";
import React from "react";
import Intro from "./pages/Intro";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import AIQTester from "./pages/AIQTester";
import JobAdvisor from "./pages/JobAdvisor";
import TechNews from "./pages/TechNews";
// Community Feature Components
import AddProfile from "./pages/AddProfile";
import Community from "./pages/Community";

import Features from "./pages/Features";
import About from "./pages/About";
import ContactPage from "./pages/ContactPage";




function App() {
  return (

    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/resume" element={<ResumeAnalyzer />} />
      <Route path="/interview" element={<AIQTester />} />
      <Route path="/career-path" element={<JobAdvisor />} />
      <Route path="/news" element={<TechNews />} />
      <Route path="/community/add" element={<AddProfile />} />
      <Route path="/community" element={<Community />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactPage />} />

    </Routes>

  );
}

export default App;
