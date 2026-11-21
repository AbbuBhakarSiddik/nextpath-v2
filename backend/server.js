// backend/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { connectDatabase } from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import Routes
import chatRoutes from "./src/routes/chatRoutes.js";
import iqRoutes from "./src/routes/iqRoutes.js";
import jobAdvisorRoutes from "./src/routes/jobAdvisorRoutes.js";
import techNewsRoutes from "./src/routes/techNewsRoutes.js";
import communityRoutes from "./src/routes/communityRoutes.js";
import bugRoutes from "./src/routes/bugRoutes.js";
import recentRoutes from "./src/routes/recentRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".vercel.app") ||
        origin === "https://nextpath-v2.vercel.app"
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for open-source API access
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Health check
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "nextpathai-backend" })
);

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/iq", iqRoutes);
app.use("/api/jobadvisor", jobAdvisorRoutes);
app.use("/api/technews", techNewsRoutes);
app.use("/api/community", communityRoutes);
app.use("/api", bugRoutes);
app.use("/api/recent", recentRoutes);

// Serve static frontend build when available (Single-Point Production Serving)
const frontendBuildPath = path.resolve(__dirname, "../frontend/build");
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  app.get("/", (_req, res) =>
    res.send("NextPath.ai backend is running 🚀 (Run 'npm run build' to bundle the frontend UI)")
  );
}

// Catch-all error handler
app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Connect to Supabase PostgreSQL (Prisma ORM)
connectDatabase();

// Start server (Only when running standalone, not inside Vercel serverless)
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`✅ NextPath.ai server running on http://localhost:${PORT}`)
  );
}

export default app;
