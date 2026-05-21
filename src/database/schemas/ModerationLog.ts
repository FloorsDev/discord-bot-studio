import mongoose from "mongoose";

const moderationLogSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    action: { type: String, enum: ["ban", "tempban", "kick", "mute", "timeout", "warn", "softban"] },
    reason: String,
    duration: Number,
    moderatorId: { type: String, required: true },
    messageUrl: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ModerationLog = mongoose.model("ModerationLog", moderationLogSchema);
