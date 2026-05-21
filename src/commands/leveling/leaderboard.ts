import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { User } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { logger } from "@utils/logger";

const slashCommand = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Veja o ranking global");

export default {
  data: slashCommand,
  async execute(interaction: CommandInteraction) {
    try {
      const topUsers = await User.find({
        guildId: interaction.guildId,
      })
        .sort({ level: -1, xp: -1 })
        .limit(10);

      if (topUsers.length === 0) {
        return interaction.reply({
          embeds: [CustomEmbed.info("Ranking", "Nenhum usuário no ranking ainda!")],
          ephemeral: true,
        });
      }

      let description = "";
      for (let i = 0; i < topUsers.length; i++) {
        const user = await interaction.client.users.fetch(topUsers[i].userId);
        description += `**${i + 1}.** ${user.tag} - Nível **${topUsers[i].level}** (${topUsers[i].xp} XP)\n`;
      }

      const embed = CustomEmbed.gaming("🏆 Ranking Global", description).setColor("#FFD700");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao buscar leaderboard:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "leaderboard",
  description: "Veja o ranking global",
  aliases: ["top", "ranking"],
  async execute(message: any) {
    try {
      const topUsers = await User.find({
        guildId: message.guildId,
      })
        .sort({ level: -1, xp: -1 })
        .limit(10);

      if (topUsers.length === 0) {
        return message.reply({
          embeds: [CustomEmbed.info("Ranking", "Nenhum usuário no ranking ainda!")],
        });
      }

      let description = "";
      for (let i = 0; i < topUsers.length; i++) {
        const user = await message.client.users.fetch(topUsers[i].userId);
        description += `**${i + 1}.** ${user.tag} - Nível **${topUsers[i].level}** (${topUsers[i].xp} XP)\n`;
      }

      const embed = CustomEmbed.gaming("🏆 Ranking Global", description).setColor("#FFD700");

      await message.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao buscar leaderboard:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
