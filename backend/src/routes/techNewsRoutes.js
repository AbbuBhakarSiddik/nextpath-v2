import express from "express";
import { getTodayNews, searchNews, refreshNews } from "../controllers/techNewsController.js";

const router = express.Router();

router.get("/today", getTodayNews);
router.get("/search", searchNews);
router.post("/refresh", refreshNews);

export default router;
