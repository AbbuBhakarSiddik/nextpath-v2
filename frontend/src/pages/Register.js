import React, { useState } from "react";
import "../styles/Register.css";
import api from "../api";

function Register() {
  const [gmail, setGmail] = useState("");
  const [verifyGmail, setVerifyGmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/register", { gmail });
      setMessage("Gmail registered successfully ✅");
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Error: Gmail already exists ❌"
      );
    }
  };

  const handleVerify = async () => {
    try {
      const res = await api.post("/verify", { gmail: verifyGmail });

      if (res.data.success) {
        setMessage("Verified ✅ Redirecting to Home...");
        window.location.href = "/Home"; // change route name if needed
      } else {
        setMessage("Gmail not found ❌");
      }
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Error verifying Gmail ❌"
      );
    }
  };
  <div className="alert alert-warning text-center mt-3" style={{ fontSize: "0.9rem" }}>
  ⏳ First time registration may take <strong>20–30 seconds</strong> because our backend
  wakes up from idle. Please wait ✅
  </div>

  return (
    <div className="register-container">
      <div className="card register-card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Registration</h3>

          {/* Gmail Registration */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
          />
          <button
            className="btn btn-primary w-100 mb-4"
            onClick={handleRegister}
          >
            Register
          </button>

          {/* Gmail Verification */}
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Re-enter Gmail"
            value={verifyGmail}
            onChange={(e) => setVerifyGmail(e.target.value)}
          />
          <button className="btn btn-success w-100" onClick={handleVerify}>
            Go to Home
          </button>

          {/* Message */}
          {message && <p className="text-center mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Register;
