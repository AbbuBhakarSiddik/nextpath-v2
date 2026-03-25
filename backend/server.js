// backend/server.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import morgan from "morgan";

// import Routes
import chatRoutes from "./src/routes/chatRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";
import iqRoutes from "./src/routes/iqRoutes.js";
import jobAdvisorRoutes from "./src/routes/jobAdvisorRoutes.js";
import techNewsRoutes from "./src/routes/techNewsRoutes.js";
import communityRoutes from "./src/routes/communityRoutes.js";
import bugRoutes from "./src/routes/bugRoutes.js"; // ✅ fixed ESM import

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://nextpath-v2.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    redentials: true,
  })
);
app.options("*", cors());
app.use(express.json({ limit: "10mb" })); // for resume uploads
app.use(morgan("dev"));

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "nextpathai-backend" })
);
app.get("/", (_req, res) => res.send("NextPath.ai backend is running 🚀"));

// Routes
app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/iq", iqRoutes);
app.use("/api/jobadvisor", jobAdvisorRoutes);
app.use("/api/technews", techNewsRoutes);
app.use("/api/community", communityRoutes);
app.use("/api", bugRoutes);


// Catch-all error handler
app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
console.log("Loaded env:", process.env.MONGO_URI);
