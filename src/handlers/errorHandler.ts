import { Client, EmbedBuilder } from "discord.js";
import { logger } from "@utils/logger";

export function setupErrorHandlers(client: Client): void {
  // Erro não capturado
  process.on("uncaughtException", (error: Error) => {
    logger.error("Erro não capturado:", error);
  });

  // Promise rejeitada
  process.on("unhandledRejection", (reason: any) => {
    logger.error("Promise rejeitada:", reason);
  });

  // Erro do Discord.js
  client.on("error", (error) => {
    logger.error("Erro do Cliente Discord:", error);
  });

  // Aviso
  client.on("warn", (message) => {
    logger.warn("Aviso do Cliente Discord:", message);
  });
}

export async function handleCommandError(
  error: Error,
  interaction: any,
  commandName: string
): Promise<void> {
  logger.error(`Erro no comando ${commandName}:`, error);

  const embed = new EmbedBuilder()
    .setColor("#ED4245")
    .setTitle("❌ Erro ao Executar Comando")
    .setDescription(`Ocorreu um erro ao executar o comando **${commandName}**.");

  try {
    if (interaction.replied) {
      await interaction.followUp({ embeds: [embed] });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  } catch (err) {
    logger.error("Erro ao responder com erro:", err);
  }
}
