// backend/src/routes/recentRoutes.js
import express from "express";
import RecentOutput from "../models/RecentOutput.js";

const router = express.Router();

// GET /api/recent — fetch recent AI outputs for showcase
router.get("/", async (req, res) => {
  try {
    const { type, limit = 20 } = req.query;

    const filter = type ? { type } : {};
    const outputs = await RecentOutput.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("type userQuery outputSummary metadata createdAt");

    res.json(outputs);
  } catch (err) {
    console.error("Error fetching recent outputs:", err);
    res.status(500).json({ error: "Failed to fetch recent outputs" });
  }
});

export default router;
