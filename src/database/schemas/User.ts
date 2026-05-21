import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    guildId: { type: String, required: true, index: true },
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    money: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    warnings: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    muteExpires: Date,
    lastDaily: Date,
    badges: [String],
    inventory: [
      {
        itemId: String,
        amount: Number,
      },
    ],
    punishmentHistory: [
      {
        action: String,
        reason: String,
        moderatorId: String,
        date: Date,
        duration: Number,
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
