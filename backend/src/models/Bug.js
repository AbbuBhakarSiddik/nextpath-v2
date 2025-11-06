import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    bug: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Bug", bugSchema);
