import mongoose from "mongoose";

const backupSchema = new mongoose.Schema(
  {
    backupId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true, index: true },
    data: mongoose.Schema.Types.Mixed,
    size: Number,
    creatorId: String,
    isAutomatic: { type: Boolean, default: false },
    restoredAt: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Backup = mongoose.model("Backup", backupSchema);
