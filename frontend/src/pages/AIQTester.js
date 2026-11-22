// frontend/src/pages/AIQTester.js
import React, { useState, useEffect, useRef } from "react";
import {
  FiAward,
  FiZap,
  FiClock,
  FiUser,
  FiEdit2,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiArrowRight,
  FiRotateCcw,
} from "react-icons/fi";
import api from "../api";
import "../styles/Aiqtester.css";

const CATEGORIES = [
  { value: "dsa", label: "Data Structures & Algos", icon: "🌲", desc: "Traps, complexity & edge cases" },
  { value: "error", label: "Code Bug Finder", icon: "🐛", desc: "Tricky outputs & runtime bugs" },
  { value: "logical", label: "Logical & Deductive", icon: "🔷", desc: "Paradoxes, game theory & riddles" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy", range: "0–20", color: "#22c55e", mult: "1.0x" },
  { value: "medium", label: "Medium", range: "20–60", color: "#38bdf8", mult: "1.5x" },
  { value: "hard", label: "Hard", range: "60–90", color: "#f59e0b", mult: "2.0x" },
  { value: "expert", label: "Expert", range: "99+", color: "#a855f7", mult: "3.0x" },
];

const TIMER_SECONDS = 120;

export default function AIQTester() {
  // Navigation & Player State
  const [activeTab, setActiveTab] = useState("arena"); // "arena" | "leaderboard"
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("np_iq_player_name") || "";
  });
  const [showNameModal, setShowNameModal] = useState(() => {
    return !localStorage.getItem("np_iq_player_name");
  });
  const [inputName, setInputName] = useState("");
  const [playerStats, setPlayerStats] = useState({
    bestScore: 0,
    maxStreak: 0,
    totalGames: 0,
  });

  // Quiz State
  const [stage, setStage] = useState("menu"); // "menu" | "question" | "result"
  const [category, setCategory] = useState("dsa");
  const [difficulty, setDifficulty] = useState("medium");
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Load player lifetime stats on mount or name change
  useEffect(() => {
    if (playerName) {
      api
        .get(`/iq/player/${encodeURIComponent(playerName)}`)
        .then((res) => {
          if (res.data) {
            setPlayerStats({
              bestScore: res.data.bestScore || 0,
              maxStreak: res.data.maxStreak || 0,
              totalGames: res.data.totalGames || 0,
            });
          }
        })
        .catch(() => {});
    }
  }, [playerName]);

  // Load leaderboard when switched to Leaderboard tab
  useEffect(() => {
    if (activeTab === "leaderboard") {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await api.get("/iq/leaderboard");
      setLeaderboard(res.data || []);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleTimeout = React.useCallback(() => {
    if (selectedAnswer !== null || !question) return;
    setSelectedAnswer(-1); // -1 indicates timeout
    setTotal((p) => p + 1);
    setStreak(0); // break streak on timeout
    setFeedback({
      correct: false,
      text: `⏱️ Time's up! The correct answer was option ${String.fromCharCode(
        65 + question.correct_index
      )}. ${question.explanation || ""}`,
    });
  }, [selectedAnswer, question]);

  // Timer effect per question
  useEffect(() => {
    if (stage === "question" && question && selectedAnswer === null) {
      setTimeLeft(TIMER_SECONDS);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [stage, question, selectedAnswer, handleTimeout]);

  const handleSavePlayerName = (e) => {
    e.preventDefault();
    const clean = inputName.trim();
    if (!clean) return;
    setPlayerName(clean);
    localStorage.setItem("np_iq_player_name", clean);
    setShowNameModal(false);
  };

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    setQuestion(null);
    setSelectedAnswer(null);
    setFeedback(null);
    clearInterval(timerRef.current);

    try {
      const res = await api.post("/iq/generate-question", { category, difficulty });
      if (!res.data?.question || !res.data?.options) {
        throw new Error("Invalid question format received");
      }
      setQuestion(res.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load question. Please retry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!playerName) {
      setShowNameModal(true);
      return;
    }
    setScore(0);
    setTotal(0);
    setStreak(0);
    setMaxStreak(0);
    setXp(0);
    setStage("question");
    await fetchQuestion();
  };

  // Multiplier logic
  const getStreakMultiplier = (currentStreak) => {
    if (currentStreak >= 5) return 3.0;
    if (currentStreak >= 3) return 2.0;
    if (currentStreak >= 2) return 1.5;
    return 1.0;
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null || loading || !question) return;
    clearInterval(timerRef.current);
    setSelectedAnswer(index);
    setTotal((p) => p + 1);

    const isCorrect = index === question.correct_index;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));

      // Calculate XP with streak multiplier
      const multiplier = getStreakMultiplier(newStreak);
      const earnedXp = Math.round(10 * multiplier);
      setXp((prev) => prev + earnedXp);
      setScore((p) => p + 1);

      setFeedback({
        correct: true,
        text: `+${earnedXp} XP (${multiplier}x streak)! ${question.explanation || "Well done!"}`,
      });
    } else {
      setStreak(0);
      setFeedback({
        correct: false,
        text: question.explanation || "Incorrect. Better luck next question!",
      });
    }
  };

  const nextQuestion = async () => {
    await fetchQuestion();
  };

  const finishQuiz = async () => {
    clearInterval(timerRef.current);
    setStage("result");

    // Save score to backend and database
    if (playerName && total > 0) {
      try {
        await api.post("/iq/submit-score", {
          playerName,
          score: xp,
          total,
          streak: maxStreak,
          category,
          difficulty,
        });

        // Update local stats
        setPlayerStats((prev) => ({
          bestScore: Math.max(prev.bestScore, xp),
          maxStreak: Math.max(prev.maxStreak, maxStreak),
          totalGames: prev.totalGames + 1,
        }));
      } catch (err) {
        console.error("Failed to submit score:", err);
      }
    }
  };

  const restart = () => {
    setStage("menu");
    setQuestion(null);
    setSelectedAnswer(null);
    setFeedback(null);
    setError(null);
    setScore(0);
    setTotal(0);
    setStreak(0);
    setMaxStreak(0);
    setXp(0);
  };

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const selDiff = DIFFICULTIES.find((d) => d.value === difficulty);
  const currentMultiplier = getStreakMultiplier(streak);

  return (
    <div className="iq-arena-page">
      {/* Player Identity Modal */}
      {showNameModal && (
        <div className="iq-modal-overlay">
          <div className="iq-modal-card glass-panel">
            <div className="text-center mb-4">
              <span className="badge-pill mb-2">
                <FiZap /> Enter Skill Arena
              </span>
              <h3 className="fw-bold text-white mb-2">Choose Your Arena Handle</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Enter your nickname to save your high scores, earn streaks, and compete on the global leaderboard.
              </p>
            </div>

            <form onSubmit={handleSavePlayerName}>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control iq-input"
                  placeholder="e.g. CodeNinja, TechTitan, DevMaster"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  maxLength={30}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="btn-neon w-100 justify-content-center py-3">
                Save Handle & Enter Arena &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="text-center mb-4">
          <span className="badge-pill mb-2">
            <FiAward /> Gamified AI Skill Arena
          </span>
          <h1 className="display-5 fw-bold text-white mb-2">Skill & IQ Arena</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Real-time, adaptive technical questions across DSA, Bug Finding, and Logical Reasoning.
          </p>
        </div>

        {/* Player Status Bar */}
        <div className="glass-panel p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="iq-avatar-pill">
              <FiUser />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white" style={{ fontSize: "1.05rem" }}>
                  {playerName || "Anonymous Challenger"}
                </span>
                <button
                  onClick={() => {
                    setInputName(playerName);
                    setShowNameModal(true);
                  }}
                  className="iq-edit-name-btn"
                  title="Change Handle"
                >
                  <FiEdit2 />
                </button>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                Personal Best: <strong style={{ color: "#00FF7F" }}>{playerStats.bestScore} XP</strong> &bull; Max Streak:{" "}
                <strong style={{ color: "#f59e0b" }}>{playerStats.maxStreak}🔥</strong>
              </span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="d-flex gap-2">
            <button
              className={`iq-tab-btn ${activeTab === "arena" ? "active" : ""}`}
              onClick={() => setActiveTab("arena")}
            >
              <FiZap /> Arena Challenge
            </button>
            <button
              className={`iq-tab-btn ${activeTab === "leaderboard" ? "active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
            >
              <FiAward /> 🏆 Leaderboard
            </button>
          </div>
        </div>

        {/* ── TAB 1: ARENA BATTLE ────────────────────────────────────────── */}
        {activeTab === "arena" && (
          <div>
            {/* Stage: Menu (Select Category & Difficulty) */}
            {stage === "menu" && (
              <div className="glass-panel p-4 p-md-5">
                <h4 className="fw-bold text-white mb-3">1. Select Battle Category</h4>
                <div className="row g-3 mb-4">
                  {CATEGORIES.map((c) => (
                    <div key={c.value} className="col-md-4">
                      <div
                        className={`iq-card-select ${category === c.value ? "selected" : ""}`}
                        onClick={() => setCategory(c.value)}
                      >
                        <div className="iq-card-icon">{c.icon}</div>
                        <h5 className="fw-bold text-white mb-1" style={{ fontSize: "1rem" }}>
                          {c.label}
                        </h5>
                        <p style={{ color: "var(--text-subtle)", fontSize: "0.8rem", margin: 0 }}>
                          {c.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="fw-bold text-white mb-3">2. Select Difficulty Level</h4>
                <div className="row g-3 mb-5">
                  {DIFFICULTIES.map((d) => (
                    <div key={d.value} className="col-6 col-md-3">
                      <div
                        className={`iq-card-select ${difficulty === d.value ? "selected" : ""}`}
                        onClick={() => setDifficulty(d.value)}
                        style={difficulty === d.value ? { borderColor: d.color } : {}}
                      >
                        <span
                          className="iq-diff-indicator"
                          style={{ backgroundColor: d.color, boxShadow: `0 0 10px ${d.color}` }}
                        />
                        <h5 className="fw-bold text-white mb-0" style={{ fontSize: "0.95rem" }}>
                          {d.label}
                        </h5>
                        <span style={{ fontSize: "0.75rem", color: d.color, fontWeight: 700 }}>
                          {d.mult} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn-neon w-100 justify-content-center py-3 fs-5"
                  onClick={startQuiz}
                >
                  Enter Battle Arena &rarr;
                </button>
              </div>
            )}

            {/* Stage: Active Question */}
            {stage === "question" && (
              <div className="glass-panel p-4 p-md-5 position-relative overflow-hidden">
                {/* Live Arena Header */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-dark">
                  {/* Streak & XP Display */}
                  <div className="d-flex align-items-center gap-3">
                    <div className={`iq-streak-badge ${streak >= 3 ? "on-fire" : ""}`}>
                      <span>🔥 {streak} Streak</span>
                      {streak >= 2 && <span className="iq-multiplier">({currentMultiplier}x XP)</span>}
                    </div>
                    <div className="iq-xp-badge">
                      <FiZap style={{ color: "#00FF7F" }} /> {xp} XP
                    </div>
                  </div>

                  {/* Question Count & Difficulty */}
                  <div className="d-flex align-items-center gap-2">
                    <span className="iq-chip">
                      Q: {score}/{total}
                    </span>
                    <span
                      className="iq-chip"
                      style={{ color: selDiff?.color, borderColor: selDiff?.color }}
                    >
                      {selDiff?.label}
                    </span>
                  </div>
                </div>

                {/* Animated Timer Bar */}
                <div className="iq-timer-container mb-4">
                  <div
                    className="iq-timer-bar"
                    style={{
                      width: `${(timeLeft / TIMER_SECONDS) * 100}%`,
                      backgroundColor: timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#f59e0b" : "#00FF7F",
                    }}
                  />
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                      <FiClock /> Time Remaining
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: timeLeft <= 5 ? "#ef4444" : "#e2e8f0",
                      }}
                    >
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success mb-3" />
                    <p style={{ color: "var(--text-muted)" }}>Races AI models to generate battle question...</p>
                  </div>
                )}

                {/* Error Fallback */}
                {error && !loading && (
                  <div className="p-3 mb-4 rounded text-center" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#fca5a5" }}>
                    <p className="mb-2">{error}</p>
                    <button className="btn-ghost" onClick={fetchQuestion}>
                      <FiRotateCcw /> Retry Question
                    </button>
                  </div>
                )}

                {/* Question Display */}
                {question && !loading && (
                  <>
                    <div className="mb-4">
                      {question.model && (
                        <span className="iq-model-tag mb-2 d-inline-block">via {question.model}</span>
                      )}
                      <h4 className="fw-bold text-white mb-3" style={{ lineHeight: "1.5" }}>
                        {question.question}
                      </h4>
                    </div>

                    {/* Options Grid */}
                    <div className="d-flex flex-column gap-3 mb-4">
                      {question.options.map((opt, i) => {
                        let stateClass = "idle";
                        if (selectedAnswer !== null) {
                          if (i === question.correct_index) stateClass = "correct";
                          else if (i === selectedAnswer) stateClass = "wrong";
                          else stateClass = "dimmed";
                        }
                        return (
                          <button
                            key={i}
                            className={`iq-option-card ${stateClass}`}
                            onClick={() => handleAnswer(i)}
                            disabled={selectedAnswer !== null}
                          >
                            <span className="iq-option-letter">{String.fromCharCode(65 + i)}</span>
                            <span className="iq-option-text">{opt}</span>
                            {stateClass === "correct" && <FiCheck className="iq-state-icon text-success" />}
                            {stateClass === "wrong" && <FiX className="iq-state-icon text-danger" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Explanation */}
                    {feedback && (
                      <div
                        className={`p-3 rounded mb-4 d-flex align-items-start gap-3 ${
                          feedback.correct ? "iq-feedback-correct" : "iq-feedback-wrong"
                        }`}
                      >
                        <div style={{ fontSize: "1.3rem" }}>
                          {feedback.correct ? "🎉" : "💡"}
                        </div>
                        <div>
                          <div className="fw-bold mb-1">
                            {feedback.correct ? "Correct Answer!" : "Incorrect!"}
                          </div>
                          <div style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>{feedback.text}</div>
                        </div>
                      </div>
                    )}

                    {/* Next / Finish Buttons */}
                    {feedback && (
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top border-dark">
                        <button className="btn-ghost" onClick={finishQuiz}>
                          Finish & Save Score
                        </button>
                        <button className="btn-neon" onClick={nextQuestion}>
                          Next Question <FiArrowRight />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Stage: Result */}
            {stage === "result" && (
              <div className="glass-panel p-5 text-center" style={{ borderRadius: "20px" }}>
                <div className="mb-3" style={{ fontSize: "3rem" }}>
                  {pct >= 80 ? "🏆" : pct >= 50 ? "⚡" : "🎯"}
                </div>

                <span className="badge-pill mb-2">Round Finished</span>
                <h2 className="display-6 fw-bold text-white mb-2">Arena Battle Complete!</h2>
                <p style={{ color: "var(--text-muted)" }}>
                  Great effort, <strong style={{ color: "#00FF7F" }}>{playerName}</strong>! Your score has been submitted to the global leaderboard.
                </p>

                {/* Score Rings & XP Summary */}
                <div className="row g-3 justify-content-center my-4">
                  <div className="col-6 col-md-3">
                    <div className="glass-panel p-3">
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#00FF7F" }}>{xp}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Total XP Earned</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-panel p-3">
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f59e0b" }}>{maxStreak}🔥</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Highest Streak</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-panel p-3">
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8" }}>{score}/{total}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Correct Answers</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="glass-panel p-3">
                      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#a855f7" }}>{pct}%</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Accuracy</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                  <button className="btn-neon" onClick={restart}>
                    <FiRotateCcw /> Play Another Battle
                  </button>
                  <button className="btn-ghost" onClick={() => setActiveTab("leaderboard")}>
                    <FiAward /> View Global Leaderboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: GLOBAL LEADERBOARD ──────────────────────────────────── */}
        {activeTab === "leaderboard" && (
          <div className="glass-panel p-4 p-md-5">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-dark">
              <div>
                <span className="badge-pill mb-1">Global Rankings</span>
                <h3 className="fw-bold text-white mb-0">Challenger Leaderboard</h3>
              </div>
              <button
                className="btn-ghost"
                onClick={fetchLeaderboard}
                disabled={loadingLeaderboard}
                title="Refresh Leaderboard"
              >
                <FiRefreshCw className={loadingLeaderboard ? "spin" : ""} /> Refresh
              </button>
            </div>

            {loadingLeaderboard ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success mb-3" />
                <p style={{ color: "var(--text-muted)" }}>Loading top scores...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-5" style={{ color: "var(--text-muted)" }}>
                <p>No challengers on the leaderboard yet. Be the first to claim Rank #1!</p>
                <button className="btn-neon mt-2" onClick={() => setActiveTab("arena")}>
                  Play Now
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table iq-leaderboard-table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}>Rank</th>
                      <th>Challenger</th>
                      <th>Score (XP)</th>
                      <th>Max Streak</th>
                      <th>Accuracy</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => {
                      const isTop1 = index === 0;
                      const isTop2 = index === 1;
                      const isTop3 = index === 2;
                      const isMe = entry.playerName?.toLowerCase() === playerName?.toLowerCase();

                      return (
                        <tr key={entry._id || index} className={isMe ? "iq-row-me" : ""}>
                          <td>
                            {isTop1 ? (
                              <span className="iq-rank-medal gold">🥇 1</span>
                            ) : isTop2 ? (
                              <span className="iq-rank-medal silver">🥈 2</span>
                            ) : isTop3 ? (
                              <span className="iq-rank-medal bronze">🥉 3</span>
                            ) : (
                              <span className="iq-rank-num">#{index + 1}</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-bold text-white">{entry.playerName}</span>
                              {isMe && <span className="badge bg-success" style={{ fontSize: "0.65rem" }}>YOU</span>}
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold" style={{ color: "#00FF7F" }}>
                              {entry.score} XP
                            </span>
                          </td>
                          <td>
                            <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                              {entry.streak || 0} 🔥
                            </span>
                          </td>
                          <td>
                            <span style={{ color: "var(--text-muted)" }}>{entry.percentage || 0}%</span>
                          </td>
                          <td>
                            <span className="iq-cat-pill">{entry.category || "General"}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
