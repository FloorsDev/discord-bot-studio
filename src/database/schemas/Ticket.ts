import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    userId: { type: String, required: true },
    category: String,
    status: { type: String, enum: ["open", "closed", "claimed"], default: "open" },
    claimedBy: String,
    claimedAt: Date,
    closedBy: String,
    closeReason: String,
    messageCount: { type: Number, default: 0 },
    messages: [
      {
        userId: String,
        content: String,
        timestamp: Date,
      },
    ],
    createdAt: { type: Date, default: Date.now },
    closedAt: Date,
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
