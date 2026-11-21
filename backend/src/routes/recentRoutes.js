// backend/src/routes/recentRoutes.js
import express from "express";
import { prisma } from "../config/db.js";

const router = express.Router();

// GET /api/recent — fetch recent AI outputs for showcase
router.get("/", async (req, res) => {
  try {
    const { type, limit = 20 } = req.query;

    const where = type ? { type } : {};
    const outputs = await prisma.aiActivity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: parseInt(limit, 10),
      select: {
        id: true,
        type: true,
        userQuery: true,
        outputSummary: true,
        metadata: true,
        createdAt: true,
      },
    });

    res.json(outputs);
  } catch (err) {
    console.error("Error fetching recent outputs:", err);
    res.status(500).json({ error: "Failed to fetch recent outputs" });
  }
});

export default router;
