// src/pages/Chat.js
import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiPlus,
  FiTrash2,
  FiMenu,
  FiX,
  FiZap,
  FiCompass,
} from "react-icons/fi";
import { getBaseUrl } from "../api";
import "../styles/Chat.css";

const SESSION_KEY = "np_chat_sessions_v2";
const TTL = 24 * 60 * 60 * 1000;

const getStreamUrl = () => `${getBaseUrl()}/api/chat/stream`;

const PERSONAS = [
  {
    id: "architect",
    name: "Staff Architect",
    icon: "🧠",
    badge: "System Design",
    welcome:
      "Hello! I am your **Staff Systems Architect**. Ask me about distributed systems, microservices design, high-concurrency scaling, or technical leadership.",
  },
  {
    id: "recruiter",
    name: "FAANG Recruiter",
    icon: "🎯",
    badge: "Hiring Bar",
    welcome:
      "Welcome! I am your **FAANG & Tech Recruiter**. Let's review your resume bullets, tackle behavioral interview questions with the STAR method, and target top tech offers.",
  },
  {
    id: "founder",
    name: "Startup Founder",
    icon: "🚀",
    badge: "0-to-1 Speed",
    welcome:
      "Hey! I am your **Startup Founder & CTO**. Ask me how to ship 0-to-1 products rapidly, choose pragmatic tech stacks, prioritize features, and cultivate full-stack ownership.",
  },
  {
    id: "junior",
    name: "Junior Mentor",
    icon: "🎓",
    badge: "Foundations",
    welcome:
      "Hi there! I am your **Senior Developer Mentor**. Whether you're breaking into tech, debugging confusing errors, or mastering coding fundamentals, I'm here to guide you step-by-step.",
  },
];

const QUICK_PROMPTS = [
  "Roadmap: Frontend to AI Engineer",
  "Mock System Design: URL Shortener at Scale",
  "FAANG Resume: How to format bullet points?",
  "STAR Method: Behavioral interview examples",
  "Monolith vs Microservices: When to migrate?",
];

// ── Markdown renderer with interactive Copy Code buttons ─────────
function renderMarkdown(text) {
  if (!text) return "";

  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks with copy button
  html = html.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    (_, lang, code) => {
      const cleanCode = code.trim();
      const encodedCode = encodeURIComponent(cleanCode);
      const languageLabel = lang ? lang.toUpperCase() : "CODE";
      return `<div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-tag">${languageLabel}</span>
          <button class="code-copy-btn" data-code="${encodedCode}" onclick="window.__copyCodeBlock(this)">
            Copy
          </button>
        </div>
        <pre class="md-pre"><code class="md-code${lang ? " lang-" + lang : ""}">${cleanCode}</code></pre>
      </div>`;
    }
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

  // Bold & Italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_\n]+)_/g, "<em>$1</em>");

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>');

  // Horizontal Rule
  html = html.replace(/^---$/gm, '<hr class="md-hr" />');

  // Numbered lists
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `<ol class="md-ol">${items}</ol>`;
  });

  // Bullet lists
  html = html.replace(/((?:^[-*] .+\n?)+)/gm, (block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^[-*] /, "")}</li>`)
      .join("");
    return `<ul class="md-ul">${items}</ul>`;
  });

  // Paragraphs
  html = html
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return "";
      if (/^<(h[23]|ul|ol|pre|hr|li|\/|div)/.test(t)) return t;
      return `<p class="md-p">${t}</p>`;
    })
    .join("\n");

  return html;
}

// ── Global copy listener for rendered code blocks ─────────────────
if (typeof window !== "undefined") {
  window.__copyCodeBlock = (buttonEl) => {
    const encoded = buttonEl.getAttribute("data-code");
    if (!encoded) return;
    const text = decodeURIComponent(encoded);
    navigator.clipboard.writeText(text).then(() => {
      buttonEl.innerText = "✓ Copied!";
      buttonEl.classList.add("copied");
      setTimeout(() => {
        buttonEl.innerText = "Copy";
        buttonEl.classList.remove("copied");
      }, 2000);
    });
  };
}

// ── Session Helpers ───────────────────────────────────────────────
function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return [];
    return JSON.parse(raw).filter((s) => Date.now() - s.createdAt < TTL);
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
  } catch {}
}

function getSessionPreview(messages) {
  const first = messages.find((m) => m.role === "user");
  return first ? first.content.slice(0, 42) : "New Conversation";
}

export default function Chat() {
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: PERSONAS[0].welcome },
  ]);
  const [loading, setLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessions, setSessions] = useState(loadSessions);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const abortController = useRef(null);
  const chatBodyRef = useRef(null);
  const currentSessionId = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showTyping]);

  // Handle persona switch
  const handlePersonaChange = (persona) => {
    setSelectedPersona(persona);
    if (messages.length <= 1) {
      setMessages([{ role: "assistant", content: persona.welcome }]);
    }
  };

  // Auto-save session
  useEffect(() => {
    if (!messages.some((m) => m.role === "user")) return;
    const all = loadSessions();
    const now = Date.now();
    if (!currentSessionId.current) currentSessionId.current = now;
    const id = currentSessionId.current;
    const idx = all.findIndex((s) => s.id === id);
    const entry = {
      id,
      personaId: selectedPersona.id,
      createdAt: idx >= 0 ? all[idx].createdAt : now,
      updatedAt: now,
      preview: getSessionPreview(messages),
      messages,
    };
    if (idx >= 0) all[idx] = entry;
    else all.unshift(entry);
    saveSessions(all);
    setSessions(loadSessions());
  }, [messages, selectedPersona]);

  // Send message with streaming
  const sendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setShowTyping(true);
    setIsStreaming(false);

    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      abortController.current = new AbortController();

      const response = await fetch(getStreamUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, persona: selectedPersona.id }),
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      setShowTyping(false);
      setIsStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);

            if (parsed.chunk) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.chunk,
                  };
                }
                return updated;
              });
            }

            if (parsed.error) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: "❌ " + parsed.error,
                };
                return updated;
              });
            }

            if (parsed.done) break;
          } catch (_) {}
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Stream error:", err);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant" && !last.content) {
            updated[updated.length - 1] = {
              role: "assistant",
              content: `❌ ${err.message || "Network issue. Please retry."}`,
            };
          }
          return updated;
        });
      }
    } finally {
      setLoading(false);
      setShowTyping(false);
      setIsStreaming(false);
      abortController.current = null;
    }
  };

  const stopMessage = () => {
    abortController.current?.abort();
    setLoading(false);
    setShowTyping(false);
    setIsStreaming(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (loading) stopMessage();
      else sendMessage();
    }
  };

  const startNewChat = () => {
    currentSessionId.current = null;
    setActiveSessionId(null);
    setMessages([{ role: "assistant", content: selectedPersona.welcome }]);
    setInput("");
    setSidebarOpen(false);
  };

  const loadSession = (session) => {
    currentSessionId.current = session.id;
    setActiveSessionId(session.id);
    const p = PERSONAS.find((item) => item.id === session.personaId) || PERSONAS[0];
    setSelectedPersona(p);
    setMessages(session.messages);
    setInput("");
    setSidebarOpen(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const updated = loadSessions().filter((s) => s.id !== id);
    saveSessions(updated);
    setSessions(updated);
    if (currentSessionId.current === id) startNewChat();
  };

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return "yesterday";
  };

  return (
    <div className="chat-page-container">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="chat-backdrop d-lg-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Glass Workspace */}
      <div className="chat-layout">
        {/* Sidebar History Drawer */}
        <aside className={`chat-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="d-flex align-items-center gap-2">
              <span className="sidebar-title">Recent Chats</span>
              <span className="badge-pill" style={{ fontSize: "0.65rem", padding: "1px 6px" }}>
                {sessions.length}
              </span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <button className="new-chat-btn" onClick={startNewChat} title="Start new chat">
                <FiPlus /> New
              </button>
              <button
                className="sidebar-close-btn d-lg-none"
                onClick={() => setSidebarOpen(false)}
              >
                <FiX />
              </button>
            </div>
          </div>

          <div className="sidebar-sessions">
            {sessions.length === 0 ? (
              <div className="sidebar-empty">
                <FiCompass style={{ fontSize: "1.5rem", marginBottom: "8px", opacity: 0.4 }} />
                <div>No recent chats</div>
                <small style={{ color: "#64748b" }}>Your session history will appear here</small>
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className={`session-item ${activeSessionId === s.id ? "active" : ""}`}
                  onClick={() => loadSession(s)}
                >
                  <div className="session-preview">{s.preview}</div>
                  <div className="session-meta">
                    <span className="session-time">{formatTime(s.updatedAt)}</span>
                    <button
                      className="session-delete"
                      onClick={(e) => deleteSession(e, s.id)}
                      title="Delete chat"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="sidebar-footer">
            <span className="sidebar-note">🔒 Local storage · 24h retention</span>
          </div>
        </aside>

        {/* Central Chat Interface */}
        <main className="chat-wrap">
          {/* Top Header & Persona Selector */}
          <div className="chat-header">
            <div className="header-top-row">
              <button
                className="mobile-sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Toggle chats drawer"
              >
                <FiMenu />
              </button>

              <div className="advisor-branding">
                <div className="advisor-avatar">{selectedPersona.icon}</div>
                <div>
                  <div className="advisor-name">
                    {selectedPersona.name}{" "}
                    <span className="advisor-status-dot" title="Online & Ready" />
                  </div>
                  <div className="advisor-sub">{selectedPersona.badge} Advisor</div>
                </div>
              </div>

              <button
                className="new-chat-quick-btn d-none d-sm-flex"
                onClick={startNewChat}
              >
                <FiPlus /> New Chat
              </button>
            </div>

            {/* Persona Selector Chips */}
            <div className="persona-pills-bar">
              {PERSONAS.map((p) => {
                const isSelected = selectedPersona.id === p.id;
                return (
                  <button
                    key={p.id}
                    className={`persona-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => handlePersonaChange(p)}
                  >
                    <span className="persona-icon">{p.icon}</span>
                    <span className="persona-label">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`msg-wrapper ${m.role === "user" ? "user-wrapper" : "assistant-wrapper"}`}
              >
                {m.role === "assistant" && (
                  <div className="msg-avatar-icon">{selectedPersona.icon}</div>
                )}
                <div
                  className={`msg ${m.role === "user" ? "user" : "assistant"} ${
                    isStreaming && i === messages.length - 1 && m.role === "assistant"
                      ? "streaming"
                      : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html:
                      m.role === "user"
                        ? m.content.replace(/\n/g, "<br/>")
                        : renderMarkdown(m.content),
                  }}
                />
              </div>
            ))}

            {showTyping && (
              <div className="msg-wrapper assistant-wrapper">
                <div className="msg-avatar-icon">{selectedPersona.icon}</div>
                <div className="msg assistant typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips (Shown when few messages) */}
          {messages.length <= 2 && (
            <div className="quick-prompts-container">
              <div className="quick-prompts-label">
                <FiZap style={{ color: "#00FF7F" }} /> Suggested Prompts
              </div>
              <div className="quick-prompts-scroll">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="quick-prompt-btn"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form Bar */}
          <div className="chat-input-wrapper">
            <div className="chat-input-box">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={`Ask ${selectedPersona.name} anything about careers, system design, or interview strategy…`}
                rows={1}
              />
              <button
                className={`chat-action-btn ${loading ? "stop-btn" : "send-btn"}`}
                onClick={loading ? stopMessage : () => sendMessage()}
                disabled={!loading && !input.trim()}
                title={loading ? "Stop generation" : "Send message (Enter)"}
              >
                {loading ? "■" : <FiSend />}
              </button>
            </div>
            <div className="input-footer-hint">
              <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for newline</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
