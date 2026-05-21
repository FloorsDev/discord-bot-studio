import mongoose from "mongoose";

const apiTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    name: String,
    lastUsed: Date,
    isActive: { type: Boolean, default: true },
    permissions: [String],
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
  },
  { timestamps: true }
);

export const ApiToken = mongoose.model("ApiToken", apiTokenSchema);
