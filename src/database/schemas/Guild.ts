import mongoose from "mongoose";

const guildSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    guildName: String,
    prefix: { type: String, default: "!" },
    language: { type: String, default: "pt-BR" },
    logChannel: String,
    modRole: String,
    muteRole: String,
    verificationChannel: String,
    verificationRoleId: String,
    ticketCategory: String,
    ticketCounter: { type: Number, default: 0 },
    welcomeChannel: String,
    goodbyeChannel: String,
    levelsEnabled: { type: Boolean, default: true },
    economyEnabled: { type: Boolean, default: true },
    ticketsEnabled: { type: Boolean, default: true },
    verificationEnabled: { type: Boolean, default: true },
    welcomeEnabled: { type: Boolean, default: true },
    autoModerationEnabled: { type: Boolean, default: true },
    badWords: [String],
    whitelistedUrls: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Guild = mongoose.model("Guild", guildSchema);
