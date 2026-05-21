import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { User } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { logger } from "@utils/logger";
import { formatNumber } from "@utils/validators";

const slashCommand = new SlashCommandBuilder()
  .setName("rank")
  .setDescription("Veja seu rank de níveis")
  .addUserOption((option) =>
    option.setName("usuário").setDescription("Usuário para verificar rank").setRequired(false)
  );

export default {
  data: slashCommand,
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser("usuário") || interaction.user;

    try {
      let userData = await User.findOne({
        userId: user.id,
        guildId: interaction.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: user.id,
          guildId: interaction.guildId,
        });
      }

      const xpForNextLevel = (userData.level + 1) * 100;
      const percentToNextLevel = Math.round((userData.xp / xpForNextLevel) * 100);

      const embed = CustomEmbed.gaming(
        `📊 ${messages.leveling.rankTitle.replace("{user}", user.username)}`,
        `**${messages.leveling.level}:** ${userData.level}\n**XP:** ${userData.xp}/${xpForNextLevel} (${percentToNextLevel}%)\n**💰 Moedas:** ${formatNumber(userData.money)}`
      )
        .setThumbnail(user.displayAvatarURL())
        .setColor("#9D4EDD");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao verificar rank:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "rank",
  description: "Veja seu rank de níveis",
  aliases: ["level", "lvl"],
  async execute(message: any, args: string[]) {
    const user = message.mentions.users.first() || message.author;

    try {
      let userData = await User.findOne({
        userId: user.id,
        guildId: message.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: user.id,
          guildId: message.guildId,
        });
      }

      const xpForNextLevel = (userData.level + 1) * 100;
      const percentToNextLevel = Math.round((userData.xp / xpForNextLevel) * 100);

      const embed = CustomEmbed.gaming(
        `📊 ${messages.leveling.rankTitle.replace("{user}", user.username)}`,
        `**${messages.leveling.level}:** ${userData.level}\n**XP:** ${userData.xp}/${xpForNextLevel} (${percentToNextLevel}%)\n**💰 Moedas:** ${formatNumber(userData.money)}`
      )
        .setThumbnail(user.displayAvatarURL())
        .setColor("#9D4EDD");

      await message.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao verificar rank:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
