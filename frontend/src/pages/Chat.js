// src/pages/Chat.js
import React, { useState, useRef, useEffect } from "react";
import { getBaseUrl } from "../api";
import "../styles/Chat.css";

const SESSION_KEY = "np_chat_sessions";
const TTL = 24 * 60 * 60 * 1000;

const getStreamUrl = () => `${getBaseUrl()}/api/chat/stream`;

// ── Markdown renderer ───────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return "";

  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks
  html = html.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre class="md-pre"><code class="md-code${lang ? " lang-" + lang : ""}">${code.trim()}</code></pre>`
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_\n]+)_/g, "<em>$1</em>");

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>');

  // HR
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
      if (/^<(h[23]|ul|ol|pre|hr|li|\/)/.test(t)) return t;
      return `<p class="md-p">${t}</p>`;
    })
    .join("\n");

  return html;
}

// ── Message bubble ──────────────────────────────────────────────
function MessageBubble({ message, isStreaming }) {
  if (message.role === "user") {
    return <div className="msg user">{message.content}</div>;
  }
  return (
    <div
      className={`msg assistant${isStreaming ? " streaming" : ""}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
    />
  );
}

// ── Session helpers ─────────────────────────────────────────────
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
  return first ? first.content.slice(0, 50) : "New chat";
}

const WELCOME = {
  role: "assistant",
  content:
    "Hi 👋 I'm your **Career Advisor**. Ask me anything about careers, skills, jobs, or courses!",
};

// ── Main component ──────────────────────────────────────────────
export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessions, setSessions] = useState(loadSessions);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const abortController = useRef(null);
  const chatBodyRef = useRef(null);
  const currentSessionId = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showTyping]);

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
      createdAt: idx >= 0 ? all[idx].createdAt : now,
      updatedAt: now,
      preview: getSessionPreview(messages),
      messages,
    };
    if (idx >= 0) all[idx] = entry;
    else all.unshift(entry);
    saveSessions(all);
    setSessions(loadSessions());
  }, [messages]);

  // ── Send message with streaming ─────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Add user message
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setShowTyping(true);
    setIsStreaming(false);

    // Placeholder for assistant reply
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      abortController.current = new AbortController();

      const response = await fetch(getStreamUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Hide typing dots once we start receiving
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
        buffer = lines.pop(); // keep partial line

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
          // Only replace if the bubble is still empty
          if (last?.role === "assistant" && !last.content) {
            updated[updated.length - 1] = {
              role: "assistant",
              content: `❌ ${err.message || "Network error. Please try again."}`,
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

  // ── Session actions ─────────────────────────────────────────
  const startNewChat = () => {
    currentSessionId.current = null;
    setActiveSessionId(null);
    setMessages([WELCOME]);
    setInput("");
  };

  const loadSession = (session) => {
    currentSessionId.current = session.id;
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setInput("");
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

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className={`chat-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Recent Chats</span>
          <button className="new-chat-btn" onClick={startNewChat}>+ New</button>
        </div>

        <div className="sidebar-sessions">
          {sessions.length === 0 ? (
            <div className="sidebar-empty">No recent chats yet</div>
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
                    title="Delete"
                  >×</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <span className="sidebar-note">Chats auto-delete after 24h</span>
        </div>
      </div>

      {/* Toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((o) => !o)}
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        {sidebarOpen ? "‹" : "›"}
      </button>

      {/* Main chat */}
      <div className="chat-wrap">
        <div className="chat-header">NextPath.ai — Career Advisor 🤖</div>

        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              message={m}
              isStreaming={
                isStreaming &&
                i === messages.length - 1 &&
                m.role === "assistant"
              }
            />
          ))}
          {showTyping && (
            <div className="msg assistant typing-dots">
              <span /><span /><span />
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
            {loading ? "■ Stop" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
