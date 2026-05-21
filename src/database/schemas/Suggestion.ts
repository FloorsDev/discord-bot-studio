import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    suggestionId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    messageId: String,
    reviewedBy: String,
    reviewReason: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Suggestion = mongoose.model("Suggestion", suggestionSchema);
