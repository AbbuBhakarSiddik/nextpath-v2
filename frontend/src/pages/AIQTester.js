import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api"; // ✅ use central api instance

export default function AIQTester() {
  const [stage, setStage] = useState("menu"); // menu | question | result
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch question from backend
  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/iq/generate-question", { category, difficulty });
      const data = res.data;

      console.log("Fetched question:", data);

      // Ensure structure
      if (!data || !data.question || !data.options) {
        throw new Error("Invalid question data received");
      }

      setQuestion(data);
    } catch (err) {
      console.error("Error fetching question:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to fetch question";

      setError(message);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Start quiz
  const startQuiz = async () => {
    setScore(0);
    setTotal(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setQuestion(null);
    setError(null);

    setStage("question");
    await fetchQuestion();
  };

  // 🔹 Handle answer
  const handleAnswer = (index) => {
    if (!question) return;

    setSelectedAnswer(index);
    setTotal((prev) => prev + 1);

    if (index === question.correct_index) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct! " + (question.explanation || ""));
    } else {
      setFeedback("❌ Wrong! " + (question.explanation || ""));
    }
  };

  // 🔹 Next question
  const nextQuestion = async () => {
    setSelectedAnswer(null);
    setFeedback(null);
    await fetchQuestion();
  };

  // 🔹 Finish quiz
  const finishQuiz = () => setStage("result");

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">🧠 NextPath.ai – AI IQ Tester</h2>

        {/* Menu screen */}
        {stage === "menu" && (
          <div>
            <h5>Select Category</h5>
            <select
              className="form-select mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Choose --</option>
              <option value="logical">Logical Reasoning</option>
              <option value="error">Error Finder</option>
              <option value="dsa">DSA</option>
            </select>

            <h5>Select Difficulty</h5>
            <select
              className="form-select mb-3"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="">-- Choose --</option>
              <option value="easy">0–20 Easy</option>
              <option value="medium">20–60 Medium</option>
              <option value="hard">60–90 Hard</option>
              <option value="expert">99+ Expert</option>
            </select>

            <button
              className="btn btn-primary w-100"
              disabled={!category || !difficulty}
              onClick={startQuiz}
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* Question screen */}
        {stage === "question" && (
          <div>
            {loading && (
              <div className="alert alert-info">
                ⏳ AI is generating a question... please wait (may take 10–20s)
              </div>
            )}

            {error && (
              <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button
                  className="btn btn-sm btn-dark"
                  onClick={fetchQuestion}
                  disabled={loading}
                >
                  Retry
                </button>
              </div>
            )}

            {question && (
              <>
                {/* Shows which model worked */}
                {question?.model && (
                  <div className="alert alert-secondary p-2">
                    ✅ Generated using: <strong>{question.model}</strong>
                  </div>
                )}

                <h5 className="mb-3">{question.question}</h5>

                <ul className="list-group mb-3">
                  {question.options.map((opt, index) => (
                    <li
                      key={index}
                      className={`list-group-item ${
                        selectedAnswer === index
                          ? index === question.correct_index
                            ? "list-group-item-success"
                            : "list-group-item-danger"
                          : ""
                      }`}
                      onClick={() =>
                        selectedAnswer === null && !loading && handleAnswer(index)
                      }
                      style={{
                        cursor: selectedAnswer === null ? "pointer" : "not-allowed",
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>

                {feedback && <div className="alert alert-info">{feedback}</div>}

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={nextQuestion}
                    disabled={!feedback || loading}
                  >
                    Next Question
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={finishQuiz}
                    disabled={!feedback}
                  >
                    Finish
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Result screen */}
        {stage === "result" && (
          <div className="text-center">
            <h4>🎉 Quiz Completed!</h4>
            <p>
              Your Score: <strong>{score}</strong> / {total}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setStage("menu");
                setQuestion(null);
                setSelectedAnswer(null);
                setFeedback(null);
                setError(null);
              }}
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
