import mongoose from "mongoose";

const giveawaySchema = new mongoose.Schema(
  {
    giveawayId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true },
    messageId: String,
    prize: { type: String, required: true },
    creatorId: String,
    participants: [String],
    winners: [String],
    winnersCount: { type: Number, default: 1 },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "ended"], default: "active" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Giveaway = mongoose.model("Giveaway", giveawaySchema);
