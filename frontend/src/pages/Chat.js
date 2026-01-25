// src/pages/Chat.js
import React, { useState, useRef, useEffect } from "react";
import "../styles/Chat.css";
import api from "../api";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 I’m your Career Advisor. Ask me anything!" },
  ]);
  const [loading, setLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const abortController = useRef(null);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
  }, [messages, loading, showTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setShowTyping(true);

    try {
      abortController.current = new AbortController();

      // ✅ Use central api instance
      const res = await api.post(
        "/chat",
        { message: text },
        { signal: abortController.current.signal }
      );

      const reply = res?.data?.reply || "⚠️ No reply received.";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "❌ Network error.";

      setMessages((m) => [...m, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
      setShowTyping(false);
      abortController.current = null;
    }
  };

  const stopMessage = () => {
    if (abortController.current) {
      abortController.current.abort();
      setLoading(false);
      setShowTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (loading) stopMessage();
      else sendMessage();
    }
  };

  return (
    <div className="chat-wrap">
      <div className="chat-header">NextPath.ai — Career Advisor🤖</div>

      <div className="chat-body" ref={chatBodyRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
        {showTyping && (
          <div className="msg assistant typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about careers, skills, courses, jobs…"
        />
        <button onClick={loading ? stopMessage : sendMessage}>
          {loading ? "Stop" : "Send"}
        </button>
      </div>
    </div>
  );
}
