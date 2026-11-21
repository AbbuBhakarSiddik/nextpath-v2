import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import AIQTester from "./pages/AIQTester";
import JobAdvisor from "./pages/JobAdvisor";
import TechNews from "./pages/TechNews";
import AddProfile from "./pages/AddProfile";
import Community from "./pages/Community";
import Features from "./pages/Features";
import About from "./pages/About";
import ContactPage from "./pages/ContactPage";

function App() {
  const location = useLocation();
  const isChat = location.pathname === "/chat";

  return (
    <Layout hideFooter={isChat}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/interview" element={<AIQTester />} />
        <Route path="/career-path" element={<JobAdvisor />} />
        <Route path="/news" element={<TechNews />} />
        <Route path="/community/add" element={<AddProfile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
