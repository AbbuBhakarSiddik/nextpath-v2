// backend/src/models/QuizScore.js
import mongoose from "mongoose";

const quizScoreSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
      index: true,
    },
    category: {
      type: String,
      default: "general",
    },
    difficulty: {
      type: String,
      default: "medium",
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

quizScoreSchema.index({ score: -1, streak: -1 });

const QuizScore = mongoose.model("QuizScore", quizScoreSchema);

export default QuizScore;
