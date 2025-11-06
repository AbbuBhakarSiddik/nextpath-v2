// src/pages/Chat.js
import React, { useState, useRef, useEffect } from "react";
import "../styles/Chat.css";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 I’m your Career Advisor. Ask me anything!" },
  ]);
  const [loading, setLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const abortController = useRef(null);
  const chatBodyRef = useRef(null);

  // Auto-scroll when new message
  useEffect(() => {
    chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight);
  }, [messages, loading, showTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // Add user message
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setShowTyping(true);

    try {
      abortController.current = new AbortController();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: abortController.current.signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      let buffer = ""; // collect stream chunks

      // Add empty assistant message first
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;

        if (result.value) {
          buffer += decoder.decode(result.value, { stream: true });

          // Try to parse valid JSON safely
          try {
            const parsed = JSON.parse(buffer);
            const currentReply = parsed.reply;

            // Update last assistant message safely
            setMessages((m) => {
              const lastMsg = m[m.length - 1];
              if (lastMsg.role === "assistant") {
                return [...m.slice(0, -1), { ...lastMsg, content: currentReply }];
              }
              return [...m, { role: "assistant", content: currentReply }];
            });
          } catch {
            // Ignore until buffer becomes a full JSON
          }
        }
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "❌ Network error." },
      ]);
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
