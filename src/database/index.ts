import mongoose from "mongoose";
import { User } from "./User";
import { Guild } from "./Guild";
import { Ticket } from "./Ticket";
import { ModerationLog } from "./ModerationLog";
import { Suggestion } from "./Suggestion";
import { Giveaway } from "./Giveaway";
import { ApiToken } from "./ApiToken";
import { Backup } from "./Backup";

export { User, Guild, Ticket, ModerationLog, Suggestion, Giveaway, ApiToken, Backup };

export async function connectDatabase(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log("✅ Banco de dados conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("✅ Banco de dados desconectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao desconectar do banco de dados:", error);
  }
}
