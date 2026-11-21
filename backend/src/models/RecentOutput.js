// backend/src/models/RecentOutput.js
import mongoose from "mongoose";

const recentOutputSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["chat", "resume", "iq", "jobadvisor"],
    },
    userQuery: { type: String, default: "" },
    outputSummary: { type: String, required: true },
    fullOutput: { type: mongoose.Schema.Types.Mixed },
    metadata: {
      model: { type: String },
      category: { type: String },
      difficulty: { type: String },
      role: { type: String },
    },
  },
  { timestamps: true }
);

// Auto-delete outputs older than 7 days
recentOutputSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

const RecentOutput = mongoose.model("RecentOutput", recentOutputSchema);

export default RecentOutput;
