// backend/src/models/Community.js
import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  education: { type: String },
  skills: { type: [String] },
  projects: { type: [String] },
  contactEmail: { type: String, required: true },
  lookingFor: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Community = mongoose.model("Community", communitySchema);

export default Community;
